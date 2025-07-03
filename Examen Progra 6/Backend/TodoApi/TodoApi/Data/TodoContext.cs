using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
using TodoApi.Models;

namespace TodoApi.Data
{
    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions<TodoContext> options) : base(options)
        {
        }

        public DbSet<Tarea> Tareas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tarea>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Titulo).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Descripcion).HasMaxLength(500);
                entity.Property(e => e.Completada).HasDefaultValue(false);
                entity.Property(e => e.Prioridad).HasDefaultValue(1);
                entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETDATE()");
            });

            // Datos de prueba
            modelBuilder.Entity<Tarea>().HasData(
                new Tarea
                {
                    Id = 1,
                    Titulo = "Tarea de ejemplo",
                    Descripcion = "Esta es una tarea de ejemplo",
                    FechaLimite = DateTime.Now.AddDays(7),
                    Completada = false,
                    Prioridad = 2,
                    FechaCreacion = DateTime.Now
                }
            );
        }
    }
}