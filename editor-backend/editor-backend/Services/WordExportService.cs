using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Text;

namespace editor_backend.Services
{
    public class WordExportService
    {
        public byte[] GenerateDocxFromJson(string jsonString)
        {
            var json = JToken.Parse(jsonString);
            using var stream = new MemoryStream();
            using var wordDoc = WordprocessingDocument.Create(stream, WordprocessingDocumentType.Document);
            var mainPart = wordDoc.AddMainDocumentPart();
            mainPart.Document = new Document();
            var body = new Body();

            Traverse(json, body);

            mainPart.Document.Append(body);
            mainPart.Document.Save();
            return stream.ToArray();
        }

        private void Traverse(JToken node, Body body)
        {
            var type = node["type"]?.ToString();

            switch (type)
            {
                case "paragraph":
                    var para = new Paragraph();
                    if (node["content"] is JArray contents)
                    {
                        foreach (var item in contents)
                        {
                            if (item["type"]?.ToString() == "text")
                            {
                                string text = item["text"]?.ToString() ?? "";
                                para.Append(new Run(new Text(text)));
                            }
                        }
                    }
                    body.Append(para);
                    break;

                case "heading":
                    var heading = new Paragraph(
                        new ParagraphProperties(
                            new ParagraphStyleId() { Val = "Heading1" }
                        )
                    );

                    if (node["content"] is JArray hContent)
                    {
                        foreach (var item in hContent)
                        {
                            if (item["type"]?.ToString() == "text")
                            {
                                string text = item["text"]?.ToString() ?? "";
                                heading.Append(new Run(new Text(text)));
                            }
                        }
                    }
                    body.Append(heading);
                    break;

                case "shape":
                    var shapePara = CreateShapeDrawingML(node);
                    body.Append(shapePara);
                    break;
            }

            if (node["content"] is JArray children)
            {
                foreach (var child in children)
                {
                    Traverse(child, body);
                }
            }
        }

        private Paragraph CreateShapeDrawingML(JToken shapeNode)
        {
            string content = shapeNode["attrs"]?["content"]?.ToString() ?? "Shape";

            return new Paragraph(new Run(new Text("[Shape: " + content + "]"))); // Placeholder text for now
        }
    }
}
