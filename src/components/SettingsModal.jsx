import { useState, useRef, useId } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Download, Upload } from 'lucide-react';
import { toLocalDateString } from '../utils/dates';
import { buildBackup, getBackupFileName, parseBackup } from '../utils/backup';
import { useUserDataForm } from '../hooks/useUserDataForm';
import { useDialog } from '../hooks/useDialog';
import UserDataFields from './UserDataFields';
import ReminderSettings from './ReminderSettings';
import ThemeSelector from './ThemeSelector';

const USER_DATA_KEY = 'respiraLibre_userData';
const GOALS_KEY = 'respiraLibre_goals';

// Convierte los datos guardados en valores del formulario
const getInitialFormData = (userData) => ({
  packPrice: userData?.packPrice || 0,
  cigarettesPerPack: userData?.cigarettesPerPack || 20,
  cigarettesPerDayBefore: userData?.cigarettesPerDayBefore || 0,
  cigarettesPerDayNow: userData?.cigarettesPerDayNow || 0,
  quitDate: toLocalDateString(userData?.quitDate ? new Date(userData.quitDate) : new Date())
});

const SettingsModal = ({ onClose, userData, onSave, onReset, theme }) => {
  // El modal se monta al abrirse (Dashboard lo envuelve en AnimatePresence), así que el formulario parte siempre de los datos actuales
  const { formData, errors, handleChange, getValidatedData } = useUserDataForm(getInitialFormData(userData));
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);
  const titleId = useId();
  const resetTitleId = useId();
  // Escape cierra el diálogo superior: la confirmación si está abierta, si no el modal
  const dialogRef = useDialog(onClose, !showResetConfirm);
  const resetDialogRef = useDialog(() => setShowResetConfirm(false), showResetConfirm);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = getValidatedData();
    if (!data) return;

    // Actualización funcional: conserva lo cambiado mientras el modal estaba abierto (p. ej. el recordatorio)
    onSave(prev => ({
      ...prev,
      ...data,
      updatedAt: new Date().toISOString()
    }));
    onClose();
  };

  // Descarga un JSON con la configuración, el registro diario y los objetivos
  const handleExport = () => {
    let goals = [];
    try {
      goals = JSON.parse(localStorage.getItem(GOALS_KEY)) ?? [];
    } catch {
      goals = [];
    }

    const blob = new Blob([JSON.stringify(buildBackup(userData, goals), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getBackupFileName();
    link.click();
    URL.revokeObjectURL(url);
  };

  // Lee y valida el archivo; los datos no se aplican hasta confirmar
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      setPendingImport(parseBackup(await file.text()));
      setImportError('');
    } catch (error) {
      setPendingImport(null);
      setImportError(error.message);
    }
  };

  const confirmImport = () => {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(pendingImport.userData));
      localStorage.setItem(GOALS_KEY, JSON.stringify(pendingImport.goals));
    } catch {
      setImportError('No se pudieron guardar los datos en el navegador');
      return;
    }
    // Recargar para que todos los componentes lean los datos importados
    window.location.reload();
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    onClose();
    // Pequeño delay para que el modal se cierre antes
    setTimeout(() => {
      if (onReset && typeof onReset === 'function') {
        onReset();
      } else {
        console.error('onReset is not a function');
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 id={titleId} className="text-2xl font-bold text-slate-900">
            Editar configuración
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" aria-hidden="true" />
          </button>
        </div>

        {/* Contenido */}
        <form id={`${titleId}-form`} onSubmit={handleSubmit} noValidate className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-6">
            <UserDataFields formData={formData} errors={errors} onChange={handleChange} variant="settings" />
          </div>

          {/* Acciones secundarias (en la zona con scroll para que el pie quepa en pantallas bajas) */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
            {/* Apariencia */}
            <ThemeSelector theme={theme} />

            {/* Recordatorio diario */}
            <ReminderSettings userData={userData} onSave={onSave} />

            {/* Copia de seguridad */}
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-1">Copia de seguridad</p>
              <p className="text-xs text-slate-500 mb-3">
                Tus datos solo están en este navegador. Descarga una copia para no perderlos o para pasarlos a otro dispositivo.
              </p>

              {pendingImport ? (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-900 mb-3">
                    La copia tiene {Object.keys(pendingImport.userData.dailyLog).length} días registrados
                    y {pendingImport.goals.length} {pendingImport.goals.length === 1 ? 'objetivo' : 'objetivos'}.
                    {' '}<strong>Reemplazará todos tus datos actuales.</strong>
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPendingImport(null)}
                      className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmImport}
                      className="flex-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Sí, importar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleExport}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Exportar datos
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Importar datos
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    onChange={handleImportFile}
                    className="hidden"
                    aria-label="Archivo de copia de seguridad"
                  />
                </div>
              )}

              {importError && (
                <p className="text-red-500 text-sm mt-2">{importError}</p>
              )}
            </div>

            {/* Botón de reiniciar */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all duration-200 border-2 border-red-200"
            >
              🔄 Reiniciar mi camino desde cero
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form={`${titleId}-form`}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" aria-hidden="true" />
              Guardar cambios
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal de confirmación de reset */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-10"
          onClick={() => setShowResetConfirm(false)}
        >
          <motion.div
            ref={resetDialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={resetTitleId}
            tabIndex={-1}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 id={resetTitleId} className="text-2xl font-bold text-slate-900 mb-2">
                ¿Reiniciar completamente?
              </h3>
              <p className="text-slate-600">
                Esta acción no se puede deshacer
              </p>
            </div>

            <div className="bg-red-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-red-900 mb-2">Esto borrará:</p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>✗ Tu historial diario completo</li>
                <li>✗ Tus objetivos guardados</li>
                <li>✗ Todas tus estadísticas</li>
                <li>✗ Todo tu progreso acumulado</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
              >
                Sí, reiniciar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SettingsModal;