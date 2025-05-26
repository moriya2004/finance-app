import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/state/api";
import { GetProductsResponse } from "@/state/types";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

const Products = () => {
  const { palette } = useTheme();
  const { data: productData } = useGetProductsQuery();
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
      alert("Please enter valid values (price > 0, expense ≥ 0)");
      return;
    }
    if (editId) {
      await updateProduct({ id: editId, data: formData });
    } else {
      await addProduct(formData);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
  };
  const productColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    }, {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params: GridCellParams) => (
        <Box display="flex" gap="0.5rem">
          <IconButton
            color="primary"
            onClick={() => handleOpen(params.row)}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <DashboardBox>
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length} products`}
        />
        <Button
          onClick={() => handleOpen()}
          sx={{
            color: palette.grey[900],
            backgroundColor: palette.grey[700],
            boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
          }}>
          Add Product
        </Button>
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
          />
        </Box>
      </DashboardBox>
      <Box>
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
    </>
  );
};

export default Products;
