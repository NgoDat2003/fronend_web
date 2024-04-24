import { Table } from "antd";
import { MdDelete } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { TinyColor } from "@ctrl/tinycolor";
import { Button, ConfigProvider, Space } from "antd";
import { callGetUser } from "../../service/api";
import { useEffect, useState } from "react";
import { render } from "react-dom";
function AdminUser() {
  const [limit, setLimit] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
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
  const handleEdit = (id) => {
    console.log(id);
  };
  const handleDelete = (id) => {
    console.log(id);
  };
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
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
            onClick={() => handleEdit(record.id)}
          >
            <BsPencilSquare />
          </button>
          <button
            className="btn_danger btn"
            onClick={() => handleDelete(record.id)}
          >
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    setCurrentPage(pagination.current);
    setLimit(pagination.pageSize);
  };
  return (
    <div className="container_admin">
      <h1>Quản lý người dùng</h1>
      <div className="manage_button">
        <button className="btn btn_warning">Thêm người dùng</button>
        <button className=" btn btn_danger">Export Excel</button>
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
    </div>
  );
}

export default AdminUser;
