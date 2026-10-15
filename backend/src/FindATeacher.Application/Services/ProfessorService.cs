
using System.Globalization;
using FindATeacher.Application.DTOs;
using FindATeacher.Application.Interfaces;
using FindATeacher.Domain.Entities;

namespace FindATeacher.Application.Services;

public class ProfessorService(IProfessorRepository repository)
{
    private static readonly string[] DiasValidos =
    [
        "segunda", "terca", "quarta", "quinta",
        "sexta", "sabado", "domingo"
    ];

    public IReadOnlyList<Professor> ObterTodos()
    {
        return repository.ObterTodos();
    }

    public BuscaProfessoresResponse Buscar(BuscarProfessoresRequest request)
    {
        Validar(request);

        var professores = repository.ObterTodos();
        var elegiveis = new List<ProfessorElegivelResponse>();
        var naoElegiveis = new List<ProfessorNaoElegivelResponse>();

        foreach (var professor in professores)
        {
            string? motivo = null;

            if (!professor.Idiomas.Any(i =>
                string.Equals(i, request.Idioma.Trim(),
                    StringComparison.OrdinalIgnoreCase)))
            {
                motivo = "Não ensina o idioma";
            }
            else if (professor.AgendaBloqueada)
            {
                motivo = "Agenda bloqueada";
            }
            else
            {
                var horarios = ObterHorarios(professor, request);

                if (horarios.Count == 0)
                    motivo = "Sem horário em comum nos dias pedidos";
                else
                {
                    elegiveis.Add(new ProfessorElegivelResponse
                    {
                        Id = professor.Id,
                        Nome = professor.Nome,
                        AulasNaSemana = professor.AulasMarcadas.Count,
                        Horarios = horarios
                    });
                }
            }

            if (motivo is not null)
            {
                naoElegiveis.Add(new ProfessorNaoElegivelResponse
                {
                    Id = professor.Id,
                    Nome = professor.Nome,
                    Motivo = motivo
                });
            }
        }

        return new BuscaProfessoresResponse
        {
            Professores = elegiveis
                .OrderBy(p => p.AulasNaSemana)
                .ThenBy(p => p.Nome, StringComparer.OrdinalIgnoreCase)
                .ToList(),
            NaoElegiveis = naoElegiveis
        };
    }

    private static List<string> ObterHorarios(
        Professor professor,
        BuscarProfessoresRequest request)
    {
        var inicioFaixa = Minutos(request.InicioFaixa);
        var fimFaixa = Minutos(request.FimFaixa);
        var horarios = new List<string>();

        for (var inicio = inicioFaixa; inicio + request.DuracaoMinutos <= fimFaixa; inicio += 30)
        {
            if (inicio % 60 != 0 && inicio % 60 != 30)
                continue;

            var fim = inicio + request.DuracaoMinutos;

            var disponivelTodosOsDias = request.Dias.All(dia =>
                professor.Disponibilidade.Any(bloco =>
                    bloco.Dia.Equals(dia, StringComparison.OrdinalIgnoreCase) &&
                    inicio >= Minutos(bloco.Inicio) &&
                    fim <= Minutos(bloco.Fim)) &&
                !professor.AulasMarcadas.Any(aula =>
                    aula.Dia.Equals(dia, StringComparison.OrdinalIgnoreCase) &&
                    inicio < Minutos(aula.Inicio) + aula.DuracaoMinutos &&
                    fim > Minutos(aula.Inicio)));

            if (disponivelTodosOsDias)
                horarios.Add(TimeSpan.FromMinutes(inicio).ToString(@"hh\:mm"));
        }

        return horarios;
    }

    private static int Minutos(string horario)
    {
        return (int)TimeSpan.ParseExact(
            horario,
            @"hh\:mm",
            CultureInfo.InvariantCulture).TotalMinutes;
    }

    private static void Validar(BuscarProfessoresRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Idioma))
            throw new ArgumentException("O idioma é obrigatório.");

        if (request.Dias is null || request.Dias.Count == 0)
            throw new ArgumentException("Informe pelo menos um dia.");

        if (request.Dias.Any(d => !DiasValidos.Contains(
            d, StringComparer.OrdinalIgnoreCase)))
            throw new ArgumentException("Um ou mais dias são inválidos.");

        if (!HorarioValido(request.InicioFaixa) ||
            !HorarioValido(request.FimFaixa))
            throw new ArgumentException("Os horários devem estar no formato HH:mm.");

        if (Minutos(request.FimFaixa) <= Minutos(request.InicioFaixa))
            throw new ArgumentException("O fim da faixa deve ser posterior ao início.");

        if (request.DuracaoMinutos is not (30 or 60 or 90))
            throw new ArgumentException("A duração deve ser 30, 60 ou 90 minutos.");
    }

    private static bool HorarioValido(string? horario)
    {
        return horario is not null &&
            TimeSpan.TryParseExact(
                horario,
                @"hh\:mm",
                CultureInfo.InvariantCulture,
                out var valor) &&
            valor >= TimeSpan.Zero &&
            valor < TimeSpan.FromDays(1);
    }
}
