import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";

interface Props {
     name: string
     accept: string,
     maxFileSize: number,
     multipleFiles: boolean,
     showEmptyTemplate?: boolean,
}

const CustomFileUpload = ({ name, accept, maxFileSize, multipleFiles, showEmptyTemplate = false }: Props) => {
     const [totalSize, setTotalSize] = useState(0);
     //const fileUploadRef = useRef<FileUpload>(null);

     const onTemplateSelect = (e: FileUploadSelectEvent) => {
          let _totalSize = totalSize;
          let files = e.files;

          for (let i = 0; i < files.length; i++) {
               _totalSize += files[i].size || 0;
          }

          setTotalSize(_totalSize);
     };

     const onTemplateUpload = (e: FileUploadUploadEvent) => {
          let _totalSize = 0;

          e.files.forEach((file) => {
               _totalSize += file.size || 0;
          });

          setTotalSize(_totalSize);
     };


     const onTemplateClear = () => {
          setTotalSize(0);
     };

     const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
          const { className, chooseButton, cancelButton } = options;

          return (
               <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                    {chooseButton}
                    {cancelButton}
               </div>
          );
     };

     const emptyTemplate = () => {
          return (
               <div className="flex align-items-center flex-column">
                    <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                    <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="pt-1 pb-3">
                         Drag and Drop Image Here
                    </span>
               </div>
          );
     };

     const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
     const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

     return (
          <div>
               <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
               <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
               <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

               <FileUpload name={name} url="/api/upload" multiple={multipleFiles} accept={accept} maxFileSize={maxFileSize}
                    onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                    headerTemplate={headerTemplate} emptyTemplate={showEmptyTemplate ? emptyTemplate : <p className="m-2" style={{ color: 'var(--text-color-secondary)' }}>Drag and drop files to here to upload.</p>}
                    chooseOptions={chooseOptions} cancelOptions={cancelOptions} />
          </div>
     )

}
export default CustomFileUpload