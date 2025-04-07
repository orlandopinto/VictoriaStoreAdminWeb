import { confirmDialog } from "primereact/confirmdialog";

export const useAlertModal = () => {
     interface Props {
          err?: any
          accept?: () => void
     }

     const showAlert = ({ err, accept }: Props) => {
          if (err) {
               confirmDialog({
                    group: 'alert',
                    message: err.errorMessage ? err.errorMessage : err.message,
                    header: 'Error',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    accept
               });
          } else {
               confirmDialog({
                    group: 'deleConfirm',
                    message: 'La session ha caducado, debe iniciar sesión nuevamente.',
                    header: 'iniciar sesión',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    accept
               });
          }
     };

     interface EndSessionProps {
          accept?: () => void
     }

     const showEndSessionAlert = ({ accept }: EndSessionProps) => {
          confirmDialog({
               group: 'endSession',
               message: 'La session ha caducado, debe iniciar sesión nuevamente.',
               header: 'iniciar sesión',
               icon: 'pi pi-exclamation-triangle',
               defaultFocus: 'accept',
               accept
          });

     };

     return { showAlert, showEndSessionAlert };
};