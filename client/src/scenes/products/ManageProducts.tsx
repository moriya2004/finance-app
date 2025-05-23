import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
  } from "@mui/material";
  import { useState } from "react";
  import {
    useGetProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
  } from "@/state/api";
  import { GetProductsResponse } from "@/state/types";
  
  const ManageProducts = () => {
    const { data: products, refetch } = useGetProductsQuery();
    const [addProduct] = useAddProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
  
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState<{ price: number; expense: number }>({
      price: 0,
      expense: 0,
    });
    const [editId, setEditId] = useState<string | null>(null);
  
    const handleOpen = (product?: GetProductsResponse) => {
      if (product) {
        setFormData({
          price: product.price,
          expense: product.expense,
        });
        setEditId(product._id);
      } else {
        setFormData({ price: 0, expense: 0 });
        setEditId(null);
      }
      setDialogOpen(true);
    };
  
    const handleSubmit = async () => {
      if (formData.price <= 0 || formData.expense < 0) {
        alert("אנא הזן ערכים תקינים (price > 0, expense ≥ 0)");
        return;
      }
  
      if (editId) {
        await updateProduct({ id: editId, data: formData });
      } else {
        await addProduct(formData);
      }
  
      setDialogOpen(false);
      refetch();
    };
  
    const handleDelete = async (id: string) => {
      await deleteProduct(id);
      refetch();
    };
  
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Manage Products
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Product
        </Button>
  
        <Box mt={2}>
          {products?.map((product) => (
            <Box
              key={product._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography>
                {`Price: ${product.price}, Expense: ${product.expense}`}
              </Typography>
              <Box>
                <Button onClick={() => handleOpen(product)}>Edit</Button>
                <Button onClick={() => handleDelete(product._id)}>Delete</Button>
              </Box>
            </Box>
          ))}
        </Box>
  
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              margin="dense"
            />
            <TextField
              fullWidth
              label="Expense"
              type="number"
              value={formData.expense}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expense: Number(e.target.value),
                }))
              }
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default ManageProducts;
  