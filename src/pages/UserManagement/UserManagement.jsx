import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import { CgUserAdd } from "react-icons/cg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosCloudDownload } from 'react-icons/io'; // Empty state download icon

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false); // For Create User
    const [selectedUser, setSelectedUser] = useState(null);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState(''); // For create user
    const [event, setEvent] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state


    useEffect(() => {
        setTimeout(() => setLoading(false), 1000); // Simulate loading time
    }, []);

    // Fetch users
    const read = () => {
        setLoading(true); // Start loading
        axios.get(`https://playpokecabook.com/api/read`) // Replace with your API endpoint
        // `${process.env.REACT_APP_BACKEND_URL}/api/read`
            .then(response => {
                setUsers(response.data);
                console.log("get", response);
                setLoading(false); // Stop loading after data is fetched
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false); // Stop loading even on error
            });
    };

    // Edit user
    const handleEdit = async (user) => {
        setSelectedUser(user);
        setNewName(user.name);
        setNewEmail(user.email);
        setShowModal(true);
        setEvent(event + 1);
    };

    // Delete user
    const getAllData = () => {
        setLoading(true); // Start loading
        axios.get(`https://playpokecabook.com/api/read`) // Replace with your API endpoint
        // `${process.env.REACT_APP_BACKEND_URL}/api/read`
            .then(response => {
                setUsers(response.data);
                setLoading(false); // Stop loading after data is fetched
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false); // Stop loading even on error
            });
    };

    const handleDelete = async (user) => {
        if (window.confirm("本当にこのユーザーを削除しますか？")) {
            console.log(user, "userID");

            await axios.delete(`https://playpokecabook.com/api/remove/${user}`) // Replace with your API endpoint
            // `${process.env.REACT_APP_BACKEND_URL}/api/remove/${user}`
                .then(() => {
                    setUsers(users.filter(user => user.userID !== user));
                    toast.success('ユーザーが削除されました');
                    read();
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        }
    };

    // Save edited user
    const handleSave = () => {
        const updatedUser = {
            ...selectedUser,
            name: newName,
            email: newEmail
        };

        axios.put(`https://playpokecabook.com/api/update/${selectedUser.userID}`, updatedUser) // Replace with your API endpoint
        // `${process.env.REACT_APP_BACKEND_URL}/api/update/${selectedUser.userID}`
            .then(response => {
                setUsers(users.map(user => user.userID === selectedUser.userID ? response.data : user));
                setShowModal(false);
                toast.success('ユーザーが更新されました');
                read();
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
        setEvent(event + 1);
    };

    // Create new user
    const handleCreate = () => {
        const newUser = {
            name: newName,
            email: newEmail,
            password: newPassword // Send password in the request
        };
        axios.post(`https://playpokecabook.com/api/create`, newUser) // Replace with your API endpoint
        // `${process.env.REACT_APP_BACKEND_URL}/api/create`
            .then(response => {
                setUsers([...users, response.data]);
                setShowCreateModal(false);
                toast.success('ユーザーが作成されました');
                read();
            })
            .catch(error => {
                console.error('Error creating user:', error);
            });
        setShowCreateModal(false);
        setNewEmail('');
        setNewName('');
        setNewPassword('');
        getAllData();
        setEvent(event + 1);
    };

    useEffect(() => {
        read();
    }, []);

    return (
        <div className="container mt-5">
            <h2>ユーザー管理</h2>
            <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                style={{ marginLeft: "5px" }} Show create user form
            >
                <CgUserAdd height="50px" width="50px" />ユーザーを追加
            </Button>
            <Table striped bordered hover className="mt-3" 
            style={{ width: "100%", 
                     margin: "0 auto", 
                     '@media : (max-width = 768px)' : {
                        width : '100%'
                     }}}>
                <thead>
                    <tr>
                        <th style={{ width: "5%" }}>No</th>
                        <th style={{ textAlign: "center" }}>名前</th>
                        <th style={{ textAlign: "center" }}>メール</th>
                        <th style={{ textAlign: "center" }}>アクション</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                <Spinner animation="border" variant="primary" />
                            </td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td style={{ height: "400px", backgroundColor: "gainsboro" }} colSpan="4">
                                <div style={{ textAlign: 'center', padding: '50px' }}>
                                    <IoIosCloudDownload size={100} />
                                    <p>データがありません</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td style={{ textAlign: "center" }}>{user.name}</td>
                                <td style={{ textAlign: "center" }}>{user.email}</td>
                                <td style={{ textAlign: "center", display: "flex", justifyContent: "space-evenly" }}>
                                    <Button variant="warning" onClick={() => handleEdit(user)}>編集</Button>
                                    <Button variant="danger" className="ml-2" onClick={() => handleDelete(user.userID)}>消去</Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Edit User Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ユーザー編集</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="userName">
                            <Form.Label>名前</Form.Label>
                            <Form.Control
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="userEmail">
                            <Form.Label>電子メール</Form.Label>
                            <Form.Control
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        キャンセル
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        はい
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Create User Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ユーザー管理</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="newUserName">
                            <Form.Label>名前</Form.Label>
                            <Form.Control
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="newUserEmail">
                            <Form.Label>メール</Form.Label>
                            <Form.Control
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="newUserPassword">
                            <Form.Label>パスワード</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        閉じる
                    </Button>
                    <Button variant="primary" onClick={handleCreate}>
                        追加
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default UserManagementPage;
