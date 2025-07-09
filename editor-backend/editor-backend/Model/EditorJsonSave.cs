using System.ComponentModel.DataAnnotations;

namespace editor_backend.Model
{
    public class EditorJsonSave
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string DocJson { get; set; }

        [Required]
        public int VerId { get; set; }

        [Required]
        public int UserId { get; set; }
    }
}
