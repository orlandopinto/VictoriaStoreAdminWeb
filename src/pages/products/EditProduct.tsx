import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Category } from "../../types";

const EditProduct = () => {
     const location = useLocation();
     let product: Category = {} as Category;

     useEffect(() => {
          product = location.state as Category;
     }, [])

     return (
          <div>Edit Product</div>
     )
}
export default EditProduct