import { ConfirmDialog } from "primereact/confirmdialog"
import { Dispatch, SetStateAction } from "react"

interface Props {
     showAlertModal: boolean
     setShowAlertModal: Dispatch<SetStateAction<boolean>>
}

const AlertDialog = ({ showAlertModal, setShowAlertModal }: Props) => {
     return (
          <ConfirmDialog
               group="alert"
               visible={showAlertModal}
               onHide={() => setShowAlertModal(false)}
               icon="pi pi-exclamation-triangle"
               acceptLabel="Aceptar"
               acceptClassName="p-button p-component p-button-raised p-button-danger"
               rejectClassName="d-none"
          />
     )
}

export default AlertDialog