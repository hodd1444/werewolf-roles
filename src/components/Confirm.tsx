import type { ReactNode } from 'react';
import { useStore } from '../store';
import { Modal } from './Modal';

export function Confirm({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,

}: {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;

}) {
  const { t } = useStore();
  return (
    <Modal onClose={onClose} title={title}>
      <div className="confirm">
        <p>{message}</p>
        <div className="editor-actions">
          <span className="spacer" />
          <button className="btn ghost" onClick={onClose}>
            {t.cancel}
          </button>
          <button
            className="btn primary"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel ?? t.confirm}
          </button>
        </div>
      </div>
    </Modal>
  );
}
