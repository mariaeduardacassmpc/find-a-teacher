using FindATeacher.Application.DTOs;
using FindATeacher.Application.Interfaces;
using FindATeacher.Application.Services;
using FindATeacher.Domain.Entities;

namespace FindATeacher.Tests.Services;

public class ProfessorServiceTests
{
    private readonly ProfessorService _service;

    public ProfessorServiceTests()
    {
        var professores = new List<Professor>
        {
            CriarProfessor(
                1, "Ana", ["Espanhol"], false,
                [("segunda", "18:00", "20:00")]),

            CriarProfessor(
                2, "Bruno", ["Inglês"], true,
                [("segunda", "18:00", "20:00")]),

            CriarProfessor(
                3, "Carla", ["Espanhol"], true,
                [("segunda", "18:00", "20:00")]),

            CriarProfessor(
                4, "Diego", ["Espanhol"], false,
                [("segunda", "18:00", "19:00"),
                 ("quarta", "19:00", "20:00")],
                [("segunda", "19:00", 60)]),

            CriarProfessor(
                5, "Elisa", ["Espanhol"], false,
                [("segunda", "18:00", "19:00"),
                 ("quarta", "19:00", "20:00")]),

            CriarProfessor(
                6, "Fabio", ["Espanhol"], false,
                [("segunda", "18:00", "20:00")],
                [("segunda", "18:00", 60)]),

            CriarProfessor(
                7, "Amanda", ["Espanhol"], false,
                [("segunda", "18:00", "20:00")]),

            CriarProfessor(
                8, "João", [""], false,
                [("segunda", "18:00", "20:00")])
        };

        _service = new ProfessorService(new FakeProfessorRepository(professores));
    }

    [Fact]
    public void Buscar_IdiomaNaoEnsinado_DeveRetornarMotivoCorreto()
    {
        var resultado = _service.Buscar(CriarRequest());

        Assert.Contains(resultado.NaoElegiveis, p =>
            p.Id == 2 && p.Motivo == "Não ensina o idioma");
    }

    [Fact]
    public void Buscar_AgendaBloqueada_NaoDeveRetornarProfessorComoElegivel()
    {
        var resultado = _service.Buscar(CriarRequest());

        Assert.DoesNotContain(resultado.Professores, p => p.Id == 3);
        Assert.Contains(resultado.NaoElegiveis, p =>
            p.Id == 3 && p.Motivo == "Agenda bloqueada");
    }

    [Fact]
    public void Buscar_DiasSemHorarioDeInicioComum_DeveExcluirProfessor()
    {
        var request = CriarRequest();
        request.Dias = ["segunda", "quarta"];

        var resultado = _service.Buscar(request);

        Assert.DoesNotContain(resultado.Professores, p => p.Id == 5);
        Assert.Contains(resultado.NaoElegiveis, p =>
            p.Id == 5 &&
            p.Motivo == "Sem horário em comum nos dias pedidos");
    }

    [Fact]
    public void Buscar_AulaMarcada_DevePermitirHorarioQueApenasEncosta()
    {
        var request = CriarRequest();
        request.InicioFaixa = "19:00";
        request.FimFaixa = "20:00";

        var resultado = _service.Buscar(request);

        Assert.DoesNotContain(resultado.Professores, p =>
            p.Id == 4 && p.Horarios.Contains("19:00"));

        Assert.Contains(resultado.Professores, p =>
            p.Id == 1 && p.Horarios.Contains("19:00"));
    }

    [Fact]
    public void Buscar_HorarioDeveCaberInteiroNaFaixaSolicitada()
    {
        var request = CriarRequest();

        request.InicioFaixa = "18:30";
        request.FimFaixa = "19:30";
        request.DuracaoMinutos = 60;

        var resultado = _service.Buscar(request);

        Assert.All(resultado.Professores, professor =>
            Assert.All(professor.Horarios, horario =>
            {
                var inicio = TimeSpan.Parse(horario);
                Assert.True(inicio >= TimeSpan.Parse("18:30"));
                Assert.True(inicio + TimeSpan.FromMinutes(60) <=
                            TimeSpan.Parse("19:30"));
            }));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Buscar_IdiomaVazio_DeveLancarExcecao(string idioma)
    {
        var request = CriarRequest();
        request.Idioma = idioma;

        Assert.Throws<ArgumentException>(() => _service.Buscar(request));
    }

    [Fact]
    public void Buscar_DeveOrdenarProfessoresPorQuantidadeDeAulasENome()
    {
        var resultado = _service.Buscar(CriarRequest());

        var ids = resultado.Professores.Select(p => p.Id).ToList();

        Assert.Equal(
            ids.OrderBy(id => resultado.Professores.First(p => p.Id == id).AulasNaSemana)
                .ThenBy(id => resultado.Professores.First(p => p.Id == id).Nome)
                .ToList(),
            ids);
    }

    private static BuscarProfessoresRequest CriarRequest() => new()
    {
        Idioma = "Espanhol",
        Dias = ["segunda"],
        InicioFaixa = "18:00",
        FimFaixa = "20:00",
        DuracaoMinutos = 60
    };

    public static Professor CriarProfessor(int id, string nome, List<string> idiomas, bool agendaBloqueada,
        List<(string Dia, string Inicio, string Fim)> disponibilidades,
        List<(string Dia, string Inicio, int Duracao)>? aulas = null)
    {
        return new Professor
        {
            Id = id,
            Nome = nome,
            Idiomas = idiomas,
            AgendaBloqueada = agendaBloqueada,
            Disponibilidade = disponibilidades.Select(d =>
                new BlocoDisponibilidade
                {
                    Dia = d.Dia,
                    Inicio = d.Inicio,
                    Fim = d.Fim
                }).ToList(),
            AulasMarcadas = (aulas ?? []).Select(a =>
                new AulaMarcada
                {
                    Dia = a.Dia,
                    Inicio = a.Inicio,
                    DuracaoMinutos = a.Duracao
                }).ToList()
        };
    }

    private sealed class FakeProfessorRepository(
        IReadOnlyList<Professor> professores) : IProfessorRepository
    {
        public IReadOnlyList<Professor> ObterTodos() => professores;
    }
}
