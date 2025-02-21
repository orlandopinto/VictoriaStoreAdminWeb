import { Card } from "primereact/card";

const Discounts = () => {
  //..::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

  return (
    <Card>
      <div className="text-center w-full">
        <h1>Discount Page</h1>
        <div className="flex justify-content-end gap-2">
          <i className="pi pi-eye" style={{ fontSize: '1.2rem', cursor: 'pointer' }}></i>
          <i className="pi pi-user-edit" style={{ fontSize: '1.2rem', cursor: 'pointer' }} ></i>
          <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} ></i>

        </div>
      </div>
      <div>
        <table className="table w-full">
          <thead>
            <tr>
              <th>HEADER UNO</th>
              <th>HEADER DOS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>contenido uno</td>
              <td>contenido dos</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

  )
}

export default Discounts