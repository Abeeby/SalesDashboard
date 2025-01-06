import { useState, useEffect } from 'react';
import { createTeam, inviteMember, getUserTeams, addVintedAccount } from '../api/teams';
import '../styles/TeamManagement.css';

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [vintedEmail, setVintedEmail] = useState('');
  const [vintedUsername, setVintedUsername] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const userTeams = await getUserTeams();
    setTeams(userTeams);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam(newTeamName);
      setNewTeamName('');
      await loadTeams();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    try {
      await inviteMember(selectedTeam, inviteEmail);
      setInviteEmail('');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddVintedAccount = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    try {
      await addVintedAccount(selectedTeam, vintedEmail, vintedUsername);
      setVintedEmail('');
      setVintedUsername('');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="team-management">
      <div className="create-team">
        <h3>Créer une équipe</h3>
        <form onSubmit={handleCreateTeam}>
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Nom de l'équipe"
            required
          />
          <button type="submit">Créer</button>
        </form>
      </div>

      {teams.length > 0 && (
        <div className="team-actions">
          <h3>Gérer l'équipe</h3>
          <select onChange={(e) => setSelectedTeam(e.target.value)}>
            <option value="">Sélectionner une équipe</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          {selectedTeam && (
            <>
              <form onSubmit={handleInviteMember}>
                <h4>Inviter un membre</h4>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email du membre"
                  required
                />
                <button type="submit">Inviter</button>
              </form>

              <form onSubmit={handleAddVintedAccount}>
                <h4>Ajouter un compte Vinted</h4>
                <input
                  type="email"
                  value={vintedEmail}
                  onChange={(e) => setVintedEmail(e.target.value)}
                  placeholder="Email Vinted"
                  required
                />
                <input
                  type="text"
                  value={vintedUsername}
                  onChange={(e) => setVintedUsername(e.target.value)}
                  placeholder="Nom d'utilisateur Vinted"
                  required
                />
                <button type="submit">Ajouter</button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
} 