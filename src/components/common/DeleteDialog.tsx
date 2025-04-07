import { ConfirmDialog } from "primereact/confirmdialog"
import { Dispatch, SetStateAction } from "react"

interface Props {
     showDeleteModal: boolean
     setShowDeleteModal: Dispatch<SetStateAction<boolean>>
     acceptDelete: () => void
     messageToDelete: string
}

const DeleteDialog = ({ showDeleteModal, setShowDeleteModal, messageToDelete, acceptDelete }: Props) => {
     return (
          <ConfirmDialog
               group="delete"
               visible={showDeleteModal}
               onHide={() => setShowDeleteModal(false)}
               message={messageToDelete}
               header="Confirmation"
               icon="pi pi-exclamation-triangle"
               acceptLabel="Eliminar"
               rejectLabel="Cancelar"
               acceptClassName="p-button p-component p-button-raised p-button-danger"
               rejectClassName="p-button p-component p-button-outlined p-button-danger"
               accept={acceptDelete}
          />
     )
}
export default DeleteDialog