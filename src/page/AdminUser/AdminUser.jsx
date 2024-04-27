import { Table, message } from "antd";
import { MdDelete } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { TinyColor } from "@ctrl/tinycolor";
import { Button, ConfigProvider, Space } from "antd";
import { FiRefreshCcw } from "react-icons/fi";
import { SiMicrosoftexcel } from "react-icons/si";
import { IoMdPersonAdd } from "react-icons/io";
import { callDeleteUser, callGetUser } from "../../service/api";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import "./AdminUser.scss";
import ModalCreateUser from "./ModalCreateUser";
import ModalUpdateUser from "./ModalUpdateUser";
import { utils, writeFile } from "xlsx";
function AdminUser() {
  const [limit, setLimit] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleUpdateUser, setVisibleUpdateUser] = useState(false);
  const [user, setUser] = useState({});
  const [visibleReadUser, setVisibleReadUser] = useState(false);
  const getUser = async () => {
    let res = await callGetUser(limit, currentPage);
    if (res && +res.EC === 0) {
      setTotal(res.DT.totalItems);
      setData(res.DT.data);
    }
  };
  useEffect(() => {
    getUser();
  }, [limit, currentPage]);
  const handleEdit = (record) => {
    setVisibleUpdateUser(true);
    setUser(record);
  };
  const handleRefesh = () => {
    setLimit(4);
    setCurrentPage(1);
  };
  const handleDeleleUser = async (id) => {
    console.log(id);
    let res = await callDeleteUser(id);
    if (res && +res.EC === 0) {
      message.success(res.EM);
      getUser();
    } else {
      message.error(res.EM);
    }
  };
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (text, record) => <a>{text}</a>,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Role",
      dataIndex: "Role",
      render: (role) => role.roleName,
      sorter: (a, b) => a.Role.roleName.localeCompare(b.Role.roleName),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
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
  };
  return (
    <div className="container_admin">
      <h1>Quản lý người dùng</h1>
      <div className="manage_button">
        <button className="btn btn_info" onClick={() => setVisible(true)}>
          <IoMdPersonAdd />
          <span style={{ marginLeft: 4 }}>Thêm người dùng</span>
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
      <Table
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
      <ModalCreateUser
        visible={visible}
        setVisible={setVisible}
        handleRefesh={handleRefesh}
      />
      <ModalUpdateUser
        visibleUpdateUser={visibleUpdateUser}
        setVisibleUpdateUser={setVisibleUpdateUser}
        user={user}
        handleRefesh={handleRefesh}
      />
    </div>
  );
}

export default AdminUser;
