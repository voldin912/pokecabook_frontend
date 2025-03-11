import React, { useState, useEffect } from 'react';
import './CategoryPage.scss';
import { Button, Table, Form, Container, Row, Col, Modal, Spinner, ToastContainer } from 'react-bootstrap';
import axios from 'axios'; // Importing axios
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

function Category() {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [inputs, setInputs] = useState([{ cardName: '', cardNumber: '', cardCondition: '' }]);
    const [editIndex, setEditIndex] = useState(null);
    const [event, setEvent] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state for data fetching
    const [formLoading, setFormLoading] = useState(false); // Loading state for form submission
    const [showCreateModal, setShowCreateModal] = useState(false); // For showing Create Modal
    const [showEditModal, setShowEditModal] = useState(false); // For showing Edit Modal

    const cardNames = [
        'オーダイル', 'ブースターex', 'ミロカロスex', 'ヤドキング', 'ピカチュウex','リザードンex',
        'テラパゴスex', 'ダイゴのメタグロスex', 'マリィのオーロンゲex', 'ドラパルトex', 'サーフゴーex', 'ソウブレイズex',
        'ブリジュラスex', 'サーナイトex', 'タケルライコex', 'Nのゾロアークex', 'ホップのザシアンex', 'テラスタルバレット',
        'ナンジャモのハラバリーex', '基本炎エネルギー', '基本雷エネルギー', '基本草エネルギー', '基本水エネルギー', '基本超エネルギー', '基本闘エネルギー', '基本悪エネルギー', '基本鋼エネルギー'
    ];

    const read = () => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getCategory`)
            .then((response) => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('カテゴリーの取得エラー:', error);
                setLoading(false);
            });
    };

    const handleSubmit = async () => {
        setFormLoading(true); // Start form submission loading

        const newCategory = { categoryName, inputs };

        if (editIndex !== null) {
            // Handle Edit (Update)
            try {
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/updateCategory/${editIndex}`, newCategory);
                const updatedCategories = [...categories];
                updatedCategories[editIndex] = response.data;
                setCategories(updatedCategories);
                resetForm();
                setShowEditModal(false);
                toast.success('カテゴリーが更新されました');
            } catch (error) {
                console.error('カテゴリー更新エラー:', error);
            }
        } else {
            // Handle Create (Add)
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/createCategory`, newCategory);
                setCategories([...categories, response.data]);
                resetForm();
                setShowCreateModal(false);
                toast.success('カテゴリーが作成されました');
            } catch (error) {
                console.error('カテゴリー作成エラー:', error);
            }
        }
        setFormLoading(false); // End form submission loading
        setEvent(event + 1);
    };

    const handleEdit = (category) => {
        setCategoryName(category.category1_var);
        const condition = JSON.parse(category.conds);
        setInputs(condition);
        setEditIndex(category.id);
        setShowEditModal(true); // Open Edit Modal
    };

    const handleDelete = (categoryId) => {
        if (window.confirm("本当にこのユーザーを削除しますか？")) {
            axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/deleteCategory/${categoryId}`)
                .then(() => {
                    const updatedCategories = categories.filter((category) => category.id !== categoryId);
                    setCategories(updatedCategories);
                    toast.success('カテゴリーが削除されました');
                })
                .catch((error) => {
                    console.error('カテゴリー削除エラー:', error);
                });
            setEvent(event + 1);
        };
    };

    const handleChange = (e, idx, field) => {
        const newInputs = [...inputs];
        newInputs[idx][field] = e.target.value;
        setInputs(newInputs);
    };

    const addInputRow = () => {
        setInputs([...inputs, { cardName: '', cardNumber: '', cardCondition: '' }]);
    };

    const removeInputRow = (idx) => {
        const newInputs = inputs.filter((_, index) => index !== idx);
        setInputs(newInputs);
    };

    const resetForm = () => {
        setCategoryName('');
        setInputs([{ cardName: '', cardNumber: '', cardCondition: '' }]);
        setEditIndex(null);
    };

    useEffect(() => {
        read();
    }, []);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getCategory`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error('カテゴリーの取得エラー:', error);
            });
    }, [event]);

    return (
        <Container className="App" style={{ margin: '0' }}>
            <h1 className="text-center my-4">カテゴリー管理</h1>

            <Row className="mb-4">
                <Col md={12}>
                    <Button variant="primary" onClick={() => {
                        resetForm(); // Reset the form values when the "Create" button is clicked
                        setShowCreateModal(true);
                    }}>
                        新しいカテゴリーを追加
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4" style={{ padding: "none" }}>
                <Col md={12} style={{ padding: "none" }}>
                    <h2>カテゴリー一覧</h2>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p>読み込み中...</p> {/* "Loading..." in Japanese */}
                        </div>
                    ) : (
                        <table striped bordered hover responsive style={{ paddingLeft: "10px", width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>No</th>
                                    <th>カテゴリー名</th>
                                    <th style={{ textAlign: "center" }}>条件</th>
                                    <th>アクション</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid grey" }}>
                                        <td>{index + 1}</td>
                                        <td>{category.category1_var}</td>
                                        <td style={{ textAlign: "center" }}>{category.conds}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => handleEdit(category)} className="mr-2">
                                                編集
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDelete(category.id)}>
                                                削除
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Col>
            </Row>

            {/* Create Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>カテゴリーを追加</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="category-form">
                        <Form.Group controlId="formCategoryName" className="mb-4">
                            <Form.Label>カテゴリー名</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="カテゴリー名を入力"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex align-items-center mb-3">
                            <Button variant="success" onClick={addInputRow} className="mr-2">
                                +
                            </Button>

                            {inputs.length > 1 && (
                                <Button variant="danger" className="mx-2" onClick={() => removeInputRow(inputs.length - 1)}>
                                    -
                                </Button>
                            )}
                        </div>

                        {inputs.map((input, idx) => (
                            <div key={idx} className="category-input-row d-flex align-items-center mb-3" style={{ display: "flex", justifyContent: "space-between" }}>
                                <Form.Group controlId={`formCardName-${idx}`} className="mr-2">
                                    <Form.Control
                                        as="select"
                                        value={input.cardName}
                                        onChange={(e) => handleChange(e, idx, 'cardName')}
                                    >
                                        <option value="">カード名を選択</option>
                                        {cardNames.map((cardName, i) => (
                                            <option key={i} value={cardName}>{cardName}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId={`formCardNumber-${idx}`} className="mr-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="カード番号"
                                        value={input.cardNumber}
                                        onChange={(e) => handleChange(e, idx, 'cardNumber')}
                                    />
                                </Form.Group>
                                <Form.Group controlId={`formCondition-${idx}`} className="mr-2">
                                    <Form.Control
                                        as="select"
                                        value={input.cardCondition}  // Set the condition here
                                        onChange={(e) => handleChange(e, idx, 'cardCondition')}
                                    >
                                        <option value="ueq">条件</option>
                                        <option value="eql">同じ</option>
                                        <option value="gte">以上</option>
                                        <option value="gtl">以下</option>
                                        <option value="ueq">反対</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        キャンセル
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={formLoading}>
                        {formLoading ? <Spinner animation="border" size="sm" /> : 'カテゴリーを追加'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>カテゴリーを編集</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="category-form">
                        <Form.Group controlId="formCategoryName" className="mb-4">
                            <Form.Label>カテゴリー名</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="カテゴリー名を入力"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex align-items-center mb-3">
                            <Button variant="success" onClick={addInputRow} className="mr-2">
                                +
                            </Button>

                            {inputs.length > 1 && (
                                <Button variant="danger" className="mx-2" onClick={() => removeInputRow(inputs.length - 1)}>
                                    -
                                </Button>
                            )}
                        </div>

                        {inputs.map((input, idx) => (
                            <div key={idx} className="category-input-row d-flex align-items-center mb-3" style={{ display: "flex", justifyContent: "space-between" }}>
                                <Form.Group controlId={`formCardName-${idx}`} className="mr-2">
                                    <Form.Control
                                        as="select"
                                        value={input.cardName}
                                        onChange={(e) => handleChange(e, idx, 'cardName')}
                                    >
                                        <option value="">カード名を選択</option>
                                        {cardNames.map((cardName, i) => (
                                            <option key={i} value={cardName}>{cardName}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId={`formCardNumber-${idx}`} className="mr-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="カード番号"
                                        value={input.cardNumber}
                                        onChange={(e) => handleChange(e, idx, 'cardNumber')}
                                    />
                                </Form.Group>
                                <Form.Group controlId={`formCondition-${idx}`} className="mr-2">
                                    <Form.Control
                                        as="select"
                                        value={input.cardCondition}  // Set the condition here
                                        onChange={(e) => handleChange(e, idx, 'cardCondition')}
                                    >
                                        <option value="ueq">条件</option>
                                        <option value="eql">同じ</option>
                                        <option value="gte">以上</option>
                                        <option value="gtl">以下</option>
                                        <option value="ueq">反対</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        キャンセル
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={formLoading}>
                        {formLoading ? <Spinner animation="border" size="sm" /> : 'カテゴリーを更新'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </Container>
    );
}

export default Category;
