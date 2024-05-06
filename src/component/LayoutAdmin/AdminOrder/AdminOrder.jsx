import { Table, message, Input, Tag } from "antd";
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
  callGetOrders,
  callGetProducts,
  callGetUser,
  callGetUserBySearch,
} from "../../../service/api";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import "./AdminOrder.scss";
// import ModalCreateUser from "./ModalCreateUser";
// import ModalUpdateUser from "./ModalUpdateUser";
import { utils, writeFile } from "xlsx";
import AdminOrderDetails from "./AdminOrderDetails/AdminOrderDetails";
import AdminCreateO from "./AdminCreateOrder";
import AdminCreateOrder from "./AdminCreateOrder";
import AdminUpdateOrder from "./AdminUpdateOrder";
const { Search } = Input;
function AdminOrder() {
  const [limit, setLimit] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleUpdateOrder, setVisibleUpdateOrder] = useState(false);
  const [order, setOrder] = useState({});
  const [sort, setSort] = useState({ field: "updatedAt", order: "desc" });
  const [search, setSearch] = useState("");
  const [tableKey, setTableKey] = useState(Math.random());
  const [visibleOrderDetails, setVisibleOrderDetails] = useState(false);
  const getOrder = async () => {
    let res = await callGetOrders(limit, currentPage, sort.field, sort.order);
    if (res && +res.EC === 0) {
      setTotal(res.DT.totalItems);
      setData(res.DT.data);
    }
  };
  useEffect(() => {
    getOrder();
  }, [limit, currentPage, sort]);
  const handleEdit = (record) => {
    setVisibleUpdateOrder(true);
    setOrder(record);
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
      getOrder(newCurrentPage, newLimit);
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
      title: "Order ID",
      dataIndex: "id",
      sorter: true,
      render: (id,a) => (
        <a
          onClick={() => {
            setOrder(a);
            setVisibleOrderDetails(true);
          }}
        >
          {id}
        </a>
      ),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      sorter: true,
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      sorter: true,
      render: (status) => {
        let color;
        switch (status) {
          case "Đã đặt hàng":
            color = "green";
            break;
          case "Đang giao hàng":
            color = "gold";
            break;
          case "Đã giao hàng":
            color = "blue";
            break;
          case "Đã hủy":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Order Payment",
      dataIndex: "orderPayment",
      sorter: true,
      render: (payment) => {
        let color;
        switch (payment) {
          case "Tiền mặt":
            color = "green";
            break;
          case "Chuyển khoản":
            color = "blue";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{payment}</Tag>;
      },
    },
    {
      title: "Order Total",
      dataIndex: "orderTotal",
      sorter: true,
      render: (total) => `${parseFloat(total).toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Order Address",
      dataIndex: "orderAddress",
      sorter: true,
    },
    {
      title: "Order Payment Status",
      dataIndex: "orderPaymentStatus",
      sorter: true,
      render: (orderPaymentStatus) => {
        let color;
        switch (orderPaymentStatus.trim().toLowerCase()) {
          case "đã thanh toán":
            color = "green";
            break;
          case "chưa thanh toán":
            color = "red";
            break;
          
          default:
            color = "default";
        }
        return <Tag color={color}>{orderPaymentStatus}</Tag>;
      },
    },
    ,
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
          {/* <button
            className="btn_danger btn"
            onClick={() => handleDeleleUser(record.id)}
          >
            <MdDelete />
          </button> */}
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
      <h1>Quản lý Đơn Hàng</h1>
      <div className="container_admin_header">
        <div className="manage_button">
          <button className="btn btn_info" onClick={() => setVisible(true)}>
            <IoMdPersonAdd />
            <span style={{ marginLeft: 4 }}>Thêm Đơn Hàng</span>
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
      <AdminOrderDetails
        visible={visibleOrderDetails}
        setVisible={setVisibleOrderDetails}
        order={order}
      />
      <AdminCreateOrder  visible={visible} setVisible={setVisible} handleRefesh={handleRefesh} />
      <AdminUpdateOrder  visibleUpdateOrder={visibleUpdateOrder} setVisibleUpdateOrder={setVisibleUpdateOrder} handleRefesh={handleRefesh} order={order} />
    </div>
  );
}

export default AdminOrder;
