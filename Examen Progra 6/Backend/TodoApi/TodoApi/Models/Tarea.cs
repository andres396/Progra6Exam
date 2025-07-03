using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class Tarea
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Titulo { get; set; } = string.Empty;

        [StringLength(500)]
        public string Descripcion { get; set; } = string.Empty;

        public DateTime FechaLimite { get; set; }

        public bool Completada { get; set; } = false;

        public int Prioridad { get; set; } = 1; // 1=Baja, 2=Media, 3=Alta

        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}