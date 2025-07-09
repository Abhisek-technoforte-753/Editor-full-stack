using Microsoft.EntityFrameworkCore;

using editor_backend.Model;

namespace editor_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<EditorJsonSave> EditorJsonSaves { get; set; }
        // ...other DbSets...
    }
}
