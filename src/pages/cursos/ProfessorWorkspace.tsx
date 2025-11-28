import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Menu } from '../../components/Menu';
import Footer from '../../components/footer';
import { fetchWithCredentials, API_BASE } from '../../api';
import { showAlert } from '../../Alert';
import { CUSTOM_MODULE_ID_OFFSET } from './courseContent.constants';
import './cursos.css';
import './ProfessorWorkspace.css';

interface ModuleSummary {
  id: number;
  assinatura: string;
  titulo: string;
  descricao: string;
  ordem: number;
}

interface QuestionDraft {
  questao: string;
  dissertativa: boolean;
  alternativas: string;
  respostaCorreta: string;
}

const defaultQuestion = (): QuestionDraft => ({
  questao: '',
  dissertativa: false,
  alternativas: '',
  respostaCorreta: '',
});

function ProfessorWorkspace() {
  const [role, setRole] = useState<'professor' | 'aluno' | null>(null);
  const [verifyingRole, setVerifyingRole] = useState(true);
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);

  const [moduleForm, setModuleForm] = useState({
    assinatura: 'universo',
    titulo: '',
    descricao: '',
    introducaoDescricao: '',
    introducaoVideo: '',
    introducaoBackground: '',
    ordem: 0,
  });
  const [savingModule, setSavingModule] = useState(false);

  const [activityForm, setActivityForm] = useState({
    moduleId: '',
    titulo: '',
    descricao: '',
    ordem: 0,
  });
  const [questions, setQuestions] = useState<QuestionDraft[]>([defaultQuestion()]);
  const [savingActivity, setSavingActivity] = useState(false);

  const [videoForm, setVideoForm] = useState({
    moduleId: '',
    titulo: '',
    subtitulo: '',
    descricao: '',
    videoUrl: '',
    backgroundUrl: '',
    ordem: 0,
  });
  const [savingVideo, setSavingVideo] = useState(false);

  useEffect(() => {
    let active = true;
    const loadRole = async () => {
      try {
        const res = await fetchWithCredentials(`${API_BASE}/auth/me`);
        if (!res.ok) {
          if (active) {
            setRole(null);
          }
          return;
        }
        const data = await res.json();
        if (active) {
          setRole(data.role === 'professor' ? 'professor' : 'aluno');
        }
      } catch {
        if (active) {
          setRole(null);
        }
      } finally {
        if (active) {
          setVerifyingRole(false);
        }
      }
    };
    loadRole();
    return () => {
      active = false;
    };
  }, []);

  const loadModules = async () => {
    setLoadingModules(true);
    try {
      const res = await fetchWithCredentials(`${API_BASE}/api/course-content/professor/modules`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Não foi possível carregar os módulos.');
      }
      const data = await res.json();
      setModules(Array.isArray(data.modules) ? data.modules : []);
      if (!activityForm.moduleId && Array.isArray(data.modules) && data.modules.length > 0) {
        setActivityForm((prev) => ({ ...prev, moduleId: String(data.modules[0].id) }));
        setVideoForm((prev) => ({ ...prev, moduleId: String(data.modules[0].id) }));
      }
    } catch (error) {
      console.error(error);
      showAlert(error instanceof Error ? error.message : 'Erro ao carregar módulos.');
    } finally {
      setLoadingModules(false);
    }
  };

  useEffect(() => {
    if (role === 'professor') {
      void loadModules();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleModuleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingModule(true);
    try {
      const res = await fetchWithCredentials(`${API_BASE}/api/course-content/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...moduleForm, atividades: [], videoAulas: [] }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Não foi possível salvar o módulo.');
      }
      showAlert('Módulo criado com sucesso!');
      setModuleForm({ assinatura: moduleForm.assinatura, titulo: '', descricao: '', introducaoDescricao: '', introducaoVideo: '', introducaoBackground: '', ordem: 0 });
      await loadModules();
    } catch (error) {
      console.error(error);
      showAlert(error instanceof Error ? error.message : 'Erro ao criar módulo.');
    } finally {
      setSavingModule(false);
    }
  };

  const handleAddQuestion = () => setQuestions((prev) => [...prev, defaultQuestion()]);
  const handleRemoveQuestion = (index: number) => setQuestions((prev) => prev.filter((_, idx) => idx !== index));

  const handleActivitySubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!activityForm.moduleId) {
      showAlert('Selecione um módulo antes de salvar a atividade.');
      return;
    }
    const payloadQuestions = questions
      .filter((questao) => questao.questao.trim().length > 0)
      .map((questao) => ({
        questao: questao.questao.trim(),
        dissertativa: questao.dissertativa,
        alternativas: questao.dissertativa
          ? undefined
          : questao.alternativas
              .split('\n')
              .map((alt) => alt.trim())
              .filter((alt) => alt.length > 0),
        respostaCorreta: questao.respostaCorreta.trim() || undefined,
      }));

    setSavingActivity(true);
    try {
      const res = await fetchWithCredentials(`${API_BASE}/api/course-content/modules/${activityForm.moduleId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: activityForm.titulo,
          descricao: activityForm.descricao,
          questoes: payloadQuestions,
          ordem: activityForm.ordem,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Não foi possível salvar a atividade.');
      }
      showAlert('Atividade adicionada!');
      setActivityForm((prev) => ({ ...prev, titulo: '', descricao: '', ordem: prev.ordem + 1 }));
      setQuestions([defaultQuestion()]);
    } catch (error) {
      console.error(error);
      showAlert(error instanceof Error ? error.message : 'Erro ao salvar atividade.');
    } finally {
      setSavingActivity(false);
    }
  };

  const handleVideoSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!videoForm.moduleId) {
      showAlert('Selecione um módulo antes de salvar o vídeo.');
      return;
    }
    setSavingVideo(true);
    try {
      const res = await fetchWithCredentials(`${API_BASE}/api/course-content/modules/${videoForm.moduleId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Não foi possível salvar o vídeo.');
      }
      showAlert('Vídeo cadastrado!');
      setVideoForm((prev) => ({ ...prev, titulo: '', subtitulo: '', descricao: '', videoUrl: '', backgroundUrl: '' }));
    } catch (error) {
      console.error(error);
      showAlert(error instanceof Error ? error.message : 'Erro ao salvar vídeo.');
    } finally {
      setSavingVideo(false);
    }
  };

  const professorHasAccess = !verifyingRole && role === 'professor';
  const needsLogin = !verifyingRole && role !== 'professor';

  const orderedModules = useMemo(() => modules.slice().sort((a, b) => a.ordem - b.ordem || a.id - b.id), [modules]);

  return (
    <>
      <Menu />
      <div className="container">
        <div className="cursos-espacamento">
          {verifyingRole && <div className="professor-card">Carregando permissões...</div>}
          {needsLogin && (
            <div className="professor-card">
              <h2>Acesso restrito</h2>
              <p>Entre com a conta de professor para criar novos conteúdos.</p>
            </div>
          )}

          {professorHasAccess && (
            <>
              <section className="professor-card">
                <h2>Criar novo módulo</h2>
                <form className="professor-form" onSubmit={handleModuleSubmit}>
                  <label>
                    Assinatura
                    <select
                      value={moduleForm.assinatura}
                      onChange={(e) => setModuleForm((prev) => ({ ...prev, assinatura: e.target.value }))}
                      required
                    >
                      <option value="universo">Universo</option>
                      <option value="galaxia">Galáxia</option>
                      <option value="orbita">Órbita</option>
                    </select>
                  </label>
                  <label>
                    Título
                    <input
                      type="text"
                      value={moduleForm.titulo}
                      onChange={(e) => setModuleForm((prev) => ({ ...prev, titulo: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Descrição
                    <textarea
                      value={moduleForm.descricao}
                      onChange={(e) => setModuleForm((prev) => ({ ...prev, descricao: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Introdução (texto)
                    <textarea
                      value={moduleForm.introducaoDescricao}
                      onChange={(e) => setModuleForm((prev) => ({ ...prev, introducaoDescricao: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Introdução (vídeo)
                    <input
                      type="url"
                      value={moduleForm.introducaoVideo}
                      onChange={(e) => setModuleForm((prev) => ({ ...prev, introducaoVideo: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Fundo do vídeo introdutório
                    <input
                      type="url"
                      value={moduleForm.introducaoBackground}
                      onChange={(e) => setModuleForm((prev) => ({ ...prev, introducaoBackground: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Ordem
                    <input
                      type="number"
                      value={moduleForm.ordem}
                      onChange={(e) => setModuleForm((prev) => ({ ...prev, ordem: Number(e.target.value) }))}
                    />
                  </label>
                  <button type="submit" disabled={savingModule}>
                    {savingModule ? 'Salvando...' : 'Criar módulo'}
                  </button>
                </form>
              </section>

              <section className="professor-card">
                <h2>Nova atividade</h2>
                <form className="professor-form" onSubmit={handleActivitySubmit}>
                  <label>
                    Módulo
                    <select
                      value={activityForm.moduleId}
                      onChange={(e) => setActivityForm((prev) => ({ ...prev, moduleId: e.target.value }))}
                      required
                    >
                      <option value="">Selecione</option>
                      {orderedModules.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          #{mod.id - CUSTOM_MODULE_ID_OFFSET} · {mod.titulo}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Título da atividade
                    <input
                      type="text"
                      value={activityForm.titulo}
                      onChange={(e) => setActivityForm((prev) => ({ ...prev, titulo: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Descrição
                    <textarea
                      value={activityForm.descricao}
                      onChange={(e) => setActivityForm((prev) => ({ ...prev, descricao: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Ordem
                    <input
                      type="number"
                      value={activityForm.ordem}
                      onChange={(e) => setActivityForm((prev) => ({ ...prev, ordem: Number(e.target.value) }))}
                    />
                  </label>

                  <div className="professor-questions">
                    <strong>Questões da atividade</strong>
                    {questions.map((questao, index) => (
                      <div key={`question-${index}`} className="professor-question-item">
                        <label>
                          Enunciado
                          <textarea
                            value={questao.questao}
                            onChange={(e) => setQuestions((prev) => prev.map((q, idx) => (idx === index ? { ...q, questao: e.target.value } : q)))}
                          />
                        </label>
                        <label className="professor-checkbox">
                          <input
                            type="checkbox"
                            checked={questao.dissertativa}
                            onChange={(e) => setQuestions((prev) => prev.map((q, idx) => (idx === index ? { ...q, dissertativa: e.target.checked } : q)))}
                          />
                          Dissertativa
                        </label>
                        {!questao.dissertativa && (
                          <label>
                            Alternativas (uma por linha)
                            <textarea
                              value={questao.alternativas}
                              onChange={(e) => setQuestions((prev) => prev.map((q, idx) => (idx === index ? { ...q, alternativas: e.target.value } : q)))}
                            />
                          </label>
                        )}
                        <label>
                          Resposta correta
                          <input
                            type="text"
                            value={questao.respostaCorreta}
                            onChange={(e) => setQuestions((prev) => prev.map((q, idx) => (idx === index ? { ...q, respostaCorreta: e.target.value } : q)))}
                          />
                        </label>
                        {questions.length > 1 && (
                          <button type="button" className="professor-danger" onClick={() => handleRemoveQuestion(index)}>
                            Remover questão
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={handleAddQuestion}>
                      Adicionar questão
                    </button>
                  </div>

                  <button type="submit" disabled={savingActivity}>
                    {savingActivity ? 'Salvando...' : 'Salvar atividade'}
                  </button>
                </form>
              </section>

              <section className="professor-card">
                <h2>Novo vídeo</h2>
                <form className="professor-form" onSubmit={handleVideoSubmit}>
                  <label>
                    Módulo
                    <select
                      value={videoForm.moduleId}
                      onChange={(e) => setVideoForm((prev) => ({ ...prev, moduleId: e.target.value }))}
                      required
                    >
                      <option value="">Selecione</option>
                      {orderedModules.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          #{mod.id - CUSTOM_MODULE_ID_OFFSET} · {mod.titulo}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Título
                    <input
                      type="text"
                      value={videoForm.titulo}
                      onChange={(e) => setVideoForm((prev) => ({ ...prev, titulo: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Subtítulo
                    <input
                      type="text"
                      value={videoForm.subtitulo}
                      onChange={(e) => setVideoForm((prev) => ({ ...prev, subtitulo: e.target.value }))}
                    />
                  </label>
                  <label>
                    Descrição
                    <textarea
                      value={videoForm.descricao}
                      onChange={(e) => setVideoForm((prev) => ({ ...prev, descricao: e.target.value }))}
                    />
                  </label>
                  <label>
                    URL do vídeo
                    <input
                      type="url"
                      value={videoForm.videoUrl}
                      onChange={(e) => setVideoForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Fundo do card
                    <input
                      type="url"
                      value={videoForm.backgroundUrl}
                      onChange={(e) => setVideoForm((prev) => ({ ...prev, backgroundUrl: e.target.value }))}
                    />
                  </label>
                  <label>
                    Ordem
                    <input
                      type="number"
                      value={videoForm.ordem}
                      onChange={(e) => setVideoForm((prev) => ({ ...prev, ordem: Number(e.target.value) }))}
                    />
                  </label>
                  <button type="submit" disabled={savingVideo}>
                    {savingVideo ? 'Salvando...' : 'Salvar vídeo'}
                  </button>
                </form>
              </section>

              <section className="professor-card">
                <h2>Módulos publicados</h2>
                {loadingModules && <p>Carregando lista...</p>}
                {!loadingModules && orderedModules.length === 0 && <p>Nenhum módulo criado ainda.</p>}
                <div className="professor-modulos-grid">
                  {orderedModules.map((mod) => (
                    <div key={mod.id} className="professor-modulo-item">
                      <strong>{mod.titulo}</strong>
                      <span>Assinatura: {mod.assinatura}</span>
                      <span>Ordem: {mod.ordem}</span>
                      <span>ID público: {mod.id}</span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ProfessorWorkspace;
