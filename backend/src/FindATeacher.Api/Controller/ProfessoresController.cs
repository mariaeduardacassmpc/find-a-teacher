using Microsoft.AspNetCore.Mvc;
using FindATeacher.Application.Services;
using FindATeacher.Application.DTOs;

namespace FindATeacher.Api.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfessoresController(ProfessorService professorService) : ControllerBase
    {

        [HttpPost("busca")]
        public IActionResult Busca([FromBody] BuscarProfessoresRequest request)
        {
            try
            {
                var resultado = professorService.Buscar(request);
                return Ok(resultado);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }        
        }      
    }
}