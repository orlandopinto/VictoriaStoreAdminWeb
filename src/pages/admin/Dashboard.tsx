import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

const Dashboard = () => {
  const [value, setValue] = useState<string>('');
  const [checked, setChecked] = useState(false);
  return (
    <>

      <Card>
        <div className="text-center">

          <h1>Dashboard Page</h1>
          <div className="doc-section-description"><p>Custom content inside a button is defined as children.</p></div>
          <Button label="Warning" severity="warning" raised />
          <div className="card flex justify-content-center">
            <InputText placeholder="prueba" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} />
          </div>
          <div className="card flex flex-column align-items-center gap-3">
            <Checkbox onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
          </div>
        </div>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi repellendus at beatae dicta ad, illo maiores doloribus magnam possimus cumque, perspiciatis quos explicabo ipsam fuga aspernatur obcaecati numquam veritatis quae.</p>
      </Card>

    </>
  )
}
export default Dashboard