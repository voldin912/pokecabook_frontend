import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import { CgDesktop} from "react-icons/cg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosCloudDownload } from 'react-icons/io'; // Empty state download icon

const CardCategoryPage = () => {
    const [cards, setCards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [newName, setNewName] = useState('');
    const [event, setEvent] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state
    const initalCard = {
        id: null,
        name: ''
    }

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000); // Simulate loading time
        console.log("newName", newName);
    }, []);

    // Fetch cards
    const read = () => {
        setLoading(true); // Start loading
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/card_detail/read`) // Replace with your API endpoint
            .then(response => {
                console.log("get", response.data);
                setCards(response.data);
                console.log("get", response);
                setLoading(false); // Stop loading after data is fetched
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
                setLoading(false); // Stop loading even on error
            });
    };

    // Edit card
    const handleEdit = async (card) => {
        setSelectedCard(card);
        setNewName(card.name);
        setShowModal(true);
        setEvent(event + 1);
    };
    const handleAdd = async () => {
        setNewName('');
        setSelectedCard(initalCard);
        setShowModal(true);
    }
    // Delete card
    const getAllData = () => {
        setLoading(true); // Start loading
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/card_detail/read`) // Replace with your API endpoint
            .then(response => {
                console.log("get", response.data);
                setCards(response.data);
                setLoading(false); // Stop loading after data is fetched
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
                setLoading(false); // Stop loading even on error
            });
    };

    const handleDelete = async (card) => {
        if (window.confirm("本当にこのユーザーを削除しますか？")) {
            console.log(card, "id");

            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/card_detail/remove/${card}`) // Replace with your API endpoint
                .then(() => {
                    setCards(cards.filter(card => card.id !== card));
                    toast.success('ユーザーが削除されました');
                    read();
                })
                .catch(error => {
                    console.error('Error deleting card:', error);
                });
        }
    };
    const handleClick = () => {
        if (selectedCard.id) {
            handleSave();
        } else {
            handleCreate();
        }
        setSelectedCard(initalCard);
        setNewName('');
    }
    // Save edited Card
    const handleSave = () => {
        const updatedCard = {
            ...selectedCard,
            name: newName
        };

        axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/card_detail/update/${selectedCard.id}`, updatedCard) // Replace with your API endpoint
            .then(response => {
                setCards(cards.map(card => card.id === selectedCard.id ? response.data : card));
                setShowModal(false);
                toast.success('ユーザーが更新されました');
                read();
            })
            .catch(error => {
                console.error('Error updating card:', error);
            });
        setEvent(event + 1);
    };

    // Create new card
    const handleCreate = () => {
        const newCard = {
            name: newName
        };
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/card_detail/create`, newCard) // Replace with your API endpoint
            .then(response => {
                setCards([...cards, response.data]);
                setShowModal(false);
                toast.success('ユーザーが作成されました');
                read();
            })
            .catch(error => {
                console.error('Error creating card:', error);
            });
        setShowModal(false);
        setNewName('');
        getAllData();
        setEvent(event + 1);
    };

    useEffect(() => {
        read();
    }, []);

    return (
        <div className="container mt-5">
            <h2>カード管理</h2>
            <Button
                variant="primary"
                onClick={handleAdd}
                style={{ marginLeft: "5px" }} Show create card form
            >
                <CgDesktop height="50px" width="50px" />カードを追加
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
                        <th style={{ textAlign: "center" }}>カード名</th>
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
                    ) : cards.length === 0 ? (
                        <tr>
                            <td style={{ height: "400px", backgroundColor: "gainsboro" }} colSpan="4">
                                <div style={{ textAlign: 'center', padding: '50px' }}>
                                    <IoIosCloudDownload size={100} />
                                    <p>データがありません</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        cards.map((card, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td style={{ textAlign: "center" }}>{card.name}</td>
                                <td style={{ textAlign: "center", display: "flex", justifyContent: "space-evenly" }}>
                                    <Button variant="warning" onClick={() => handleEdit(card)}>編集</Button>
                                    <Button variant="danger" className="ml-2" onClick={() => handleDelete(card.id)}>消去</Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Edit card Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>カードを追加</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="cardName">
                            <Form.Label>カード名</Form.Label>
                            <Form.Control
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        キャンセル
                    </Button>
                    <Button variant="primary" onClick={handleClick}>
                        はい
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default CardCategoryPage;
