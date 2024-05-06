import { Table, message, Input } from "antd";
import { MdDelete } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { TinyColor } from "@ctrl/tinycolor";
import { Button, ConfigProvider, Space } from "antd";
import { FiRefreshCcw } from "react-icons/fi";
import { SiMicrosoftexcel } from "react-icons/si";
import { IoMdPersonAdd } from "react-icons/io";
import {
  callDeleteProduct,
  callDeleteUser,
  callGetProducts,
  callGetUser,
  callGetUserBySearch,
} from "../../../service/api";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import "./AdminProduct.scss";
// import ModalCreateUser from "./ModalCreateUser";
// import ModalUpdateUser from "./ModalUpdateUser";
import { utils, writeFile } from "xlsx";
import ModalCreateProduct from "./ModalCreateProduct";
import ModalUpdateProduct from "./ModalUpdateProduct";
const { Search } = Input;
function AdminProduct() {
  const [limit, setLimit] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleUpdateProduct, setVisibleUpdateProduct] = useState(false);
  const [product, setProduct] = useState({});
  const [sort, setSort] = useState({ field: "updatedAt", order: "desc" });
  const [search, setSearch] = useState("");
  const [tableKey, setTableKey] = useState(Math.random());
  const getProduct = async () => {
    let res = await callGetProducts(limit, currentPage, sort.field, sort.order);
    if (res && +res.EC === 0) {
      setTotal(res.DT.totalItems);
      setData(res.DT.data);
    }
  };
  useEffect(() => {
    getProduct();
  }, [limit, currentPage, sort]);
  const handleEdit = (record) => {
    setVisibleUpdateProduct(true);
    setProduct(record);
  };
  const handleRefesh = () => {
    const newLimit = 4;
    const newCurrentPage = 1;

    if (limit !== newLimit) {
      setLimit(newLimit);
    }

    if (currentPage !== newCurrentPage) {
      setCurrentPage(newCurrentPage);
    }
    if (sort.field !== "updatedAt" || sort.order !== "desc") {
      setSort({ field: "updatedAt", order: "desc" });
      setTableKey(Math.random());
    }

    if (limit === newLimit && currentPage === newCurrentPage) {
      getProduct(newCurrentPage, newLimit);
    }
  };
  const handleDeleleUser = async (id) => {
    let res = await callDeleteProduct(id);
    if (res && +res.EC === 0) {
      message.success(res.EM);
      handleRefesh();
    } else {
      message.error(res.EM);
    }
  };
  const columns = [
    {
      title: "Product ID",
      dataIndex: "id",
      sorter: true,
      render: (text, record) => <a>{text}</a>,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      sorter: true,
    },
    {
      title: "CategoryID",
      dataIndex: "categoryId",
      sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `${parseFloat(price).toLocaleString("vi-VN")} VND`,
      sorter: true,
    },
    {
      title: "Stock Quantity",
      dataIndex: "stockQuantity",
      sorter: true,
    },
    {
      title: "Create At",
      dataIndex: "createdAt",
      sorter: true,
      render: (date) => {
        const d = new Date(date);
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${d.getDate()}/${
          d.getMonth() + 1
        }/${d.getFullYear()}`;
      },
    },
    {
      title: "Update At",
      dataIndex: "updatedAt",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "descend",
      render: (date) => {
        const d = new Date(date);
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${d.getDate()}/${
          d.getMonth() + 1
        }/${d.getFullYear()}`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn_warning btn"
            onClick={() => handleEdit(record)}
          >
            <BsPencilSquare />
          </button>
          <button
            className="btn_danger btn"
            onClick={() => handleDeleleUser(record.id)}
          >
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];
  const exportToExcel = (data, fileName) => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");

    writeFile(wb, fileName);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    setCurrentPage(pagination.current);
    setLimit(pagination.pageSize);
    if (sorter?.order === undefined) {
      // If the order is undefined, reset the sort state
      setSort({ field: "", order: "" });
    } else {
      // Otherwise, update the sort state with the new field and order
      setSort({
        field: sorter.field,
        order: sorter.order === "ascend" ? "asc" : "desc",
      });
    }
  };
  return (
    <div className="container_admin">
      <h1>Quản lý sản phẩm</h1>
      <div className="container_admin_header">
        <div className="manage_button">
          <button className="btn btn_info" onClick={() => setVisible(true)}>
            <IoMdPersonAdd />
            <span style={{ marginLeft: 4 }}>Thêm sản phẩm</span>
          </button>
          <button
            className=" btn btn_success"
            onClick={() => exportToExcel(data, "users.xlsx")}
          >
            <SiMicrosoftexcel />
            <span style={{ marginLeft: 4 }}>Export Excel</span>
          </button>
          <button className="btn_info btn" onClick={() => handleRefesh()}>
            <FiRefreshCcw /> <span style={{ marginLeft: 4 }}>Refresh</span>
          </button>
        </div>
      </div>
      <Table
        key={tableKey}
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: total,

          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15", "20"],

          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
      <ModalCreateProduct
        visible={visible}
        setVisible={setVisible}
        handleRefesh={handleRefesh}
      />
      <ModalUpdateProduct
        visibleUpdateProduct={visibleUpdateProduct}
        setVisibleUpdateProduct={setVisibleUpdateProduct}
        product={product}
        handleRefesh={handleRefesh}
      />
    </div>
  );
}

export default AdminProduct;
