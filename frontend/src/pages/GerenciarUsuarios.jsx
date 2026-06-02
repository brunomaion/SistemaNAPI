import { useEffect, useState } from "react";
import "./GerenciarUsuarios.css";
import Header from "../components/Header";

function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [editUsuario, setEditUsuario] = useState({});
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);


  const buscarUsuarios = async () => {
      try {
          const response = await fetch("http://localhost:8080/usuarios");

          if (!response.ok) {
              setMensagem("Erro ao buscar usuários");
              return;
          }

          const data = await response.json();
          setUsuarios(data);

      } catch (error) {
          setMensagem("Erro ao conectar com servidor");
      }
  };

  useEffect(() => {
      buscarUsuarios();
  }, []);



  const iniciarEdicao = (usuario) => {
    setEditandoId(usuario.id);
    setEditUsuario(usuario);
  };


  const handleEditChange = (e) => {
    setEditUsuario({
        ...editUsuario,
        [e.target.name]: e.target.value
    });
  };


  const salvarEdicao = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/${editUsuario.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editUsuario),
        }
      );

      const data = await response.json();

      if (!response.ok || data.sucesso === false) {
        setMensagem(data.mensagem || "Erro ao atualizar usuário");
        return;
      }

      setMensagem("Usuário atualizado com sucesso");

      setEditandoId(null);
      setEditUsuario({});

      buscarUsuarios();

    } catch (error) {
      setMensagem("Erro ao atualizar usuário");
    }
  };

  return (
    <div className="admin-container">
      <Header />

      <div className="admin-content">

        <div className="admin-header">
          <h1>Gerenciar Usuários</h1>

          <button
              className="btn-refresh"
              onClick={buscarUsuarios}
          >
              Atualizar Lista
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>

                  {/* USERNAME */}
                  <td>
                    {editandoId === usuario.id ? (
                        <input
                            name="username"
                            value={editUsuario.username || ""}
                            onChange={handleEditChange}
                        />
                    ) : (
                        usuario.username
                    )}
                  </td>

                  {/* NOME */}
                  <td>
                    {editandoId === usuario.id ? (
                        <input
                            name="nome"
                            value={editUsuario.nome || ""}
                            onChange={handleEditChange}
                        />
                    ) : (
                        usuario.nome
                    )}
                  </td>

                  {/* EMAIL */}
                  <td>
                    {editandoId === usuario.id ? (
                        <input
                            name="email"
                            value={editUsuario.email || ""}
                            onChange={handleEditChange}
                        />
                    ) : (
                        usuario.email
                    )}
                  </td>

                  {/* TELEFONE */}
                  <td>
                    {editandoId === usuario.id ? (
                        <input
                            name="telefone"
                            value={editUsuario.telefone || ""}
                            onChange={handleEditChange}
                        />
                    ) : (
                        usuario.telefone
                    )}
                  </td>

                  {/* ENDEREÇO */}
                  <td>
                    {editandoId === usuario.id ? (
                      <input
                        name="endereco"
                        value={editUsuario.endereco || ""}
                        onChange={handleEditChange}
                      />
                    ) : (
                        usuario.endereco
                    )}
                  </td>

                  {/* AÇÕES */}
                  <td className="actions">
                    {editandoId === usuario.id ? (
                      <>
                        <button
                            className="btn-edit"
                            onClick={salvarEdicao}
                        >
                            Salvar
                        </button>

                        <button
                            className="btn-delete"
                            onClick={() => setEditandoId(null)}
                        >
                            Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                            className="btn-edit"
                            onClick={() => iniciarEdicao(usuario)}
                        >
                            Editar
                        </button>

                        <button
                            className="btn-delete"
                            onClick={() => setUsuarioParaExcluir(usuario)}
                        >
                            Excluir
                        </button>
                        </>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhum usuário encontrado</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mensagem_container">
            <div className="mensagem">
                {mensagem && <p>{mensagem}</p>}
            </div>
        </div>

      </div>
      {usuarioParaExcluir && (
        <div className="modal-overlay">
          <div className="modal">

              <h2>Confirmar exclusão</h2>

              <p>
                  Tem certeza que deseja excluir o usuário: <br />
                  <strong>{usuarioParaExcluir.nome}</strong>?
              </p>

              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button onClick={() => setUsuarioParaExcluir(null)}>
                      Cancelar
                  </button>

                  <button
                      onClick={async () => {
                          try {
                              const response = await fetch(
                                  `http://localhost:8080/usuarios/${usuarioParaExcluir.id}`,
                                  {
                                      method: "DELETE",
                                  }
                              );

                              if (!response.ok) {
                                  setMensagem("Erro ao deletar usuário");
                                  return;
                              }

                              setUsuarios(
                                  usuarios.filter(
                                      (u) => u.id !== usuarioParaExcluir.id
                                  )
                              );

                              setMensagem("Usuário removido com sucesso");
                              setUsuarioParaExcluir(null);

                          } catch (error) {
                              setMensagem("Erro ao deletar usuário");
                          }
                      }}
                      style={{
                          background: "#ff4c4c",
                          color: "white",
                          border: "none",
                          padding: "10px 15px",
                          borderRadius: "8px",
                          cursor: "pointer"
                      }}
                  >
                      Excluir
                  </button>
              </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarUsuarios;