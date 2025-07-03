using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TareasController : ControllerBase
    {
        private readonly TodoContext _context;

        public TareasController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/tareas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tarea>>> GetTareas(
            [FromQuery] bool? completada = null,
            [FromQuery] string? orderBy = null,
            [FromQuery] string? buscar = null)
        {
            IQueryable<Tarea> query = _context.Tareas;

            // Filtrar por estado (completada/pendiente)
            if (completada.HasValue)
            {
                query = query.Where(t => t.Completada == completada.Value);
            }

            // Búsqueda por título o descripción
            if (!string.IsNullOrEmpty(buscar))
            {
                query = query.Where(t =>
                    t.Titulo.Contains(buscar) ||
                    t.Descripcion.Contains(buscar));
            }

            // Ordenar por fecha límite o prioridad
            query = orderBy?.ToLower() switch
            {
                "fechalimite" => query.OrderBy(t => t.FechaLimite),
                "prioridad" => query.OrderByDescending(t => t.Prioridad),
                _ => query.OrderBy(t => t.FechaCreacion)
            };

            return await query.ToListAsync();
        }

        // GET: api/tareas/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Tarea>> GetTarea(int id)
        {
            var tarea = await _context.Tareas.FindAsync(id);

            if (tarea == null)
            {
                return NotFound();
            }

            return tarea;
        }

        // POST: api/tareas
        [HttpPost]
        public async Task<ActionResult<Tarea>> CreateTarea(Tarea tarea)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tarea.FechaCreacion = DateTime.Now;
            _context.Tareas.Add(tarea);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTarea), new { id = tarea.Id }, tarea);
        }

        // PUT: api/tareas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTarea(int id, Tarea tarea)
        {
            if (id != tarea.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(tarea).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TareaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/tareas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTarea(int id)
        {
            var tarea = await _context.Tareas.FindAsync(id);
            if (tarea == null)
            {
                return NotFound();
            }

            _context.Tareas.Remove(tarea);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TareaExists(int id)
        {
            return _context.Tareas.Any(e => e.Id == id);
        }
    }
}