import type { RoleDef } from '../data/roles';
import { useStore } from '../store';
import { RoleCard } from './Card';
import { Modal } from './Modal';

export function RoleInfo({ role, onClose }: { role: RoleDef; onClose: () => void }) {
  const { name, desc } = useStore();
  return (
    <Modal onClose={onClose} title={name(role)}>
      <div className="role-info">
        <RoleCard role={role} />
        <p>{desc(role)}</p>
      </div>
    </Modal>
  );
}
