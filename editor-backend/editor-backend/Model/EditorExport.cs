using System;

namespace editor_backend.Model
{
    public class EditorExport
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string JsonContent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
