import React from 'react';
import { Card, Col } from 'antd';

const PokemonCard = () => {
    return(
        <Col xs={6} sm={6} md={6} lg={4}>
            <Card
              title="Card title"
              bordered={false}
              cover={
                <img
                  alt="example"
                  src="https://www.pokemon-card.com/assets/images/card_images/large/SV8a/046813_T_KIRAMEKUKESSHIXYOU.jpg"
                />
              }
            >
              <table>
                <tbody>
                  <tr>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                  </tr>
                  <tr>
                    <td>aa</td>
                    <td>aa</td>
                    <td>aa</td>
                  </tr>
                  <tr>
                    <td>xx</td>
                    <td>xx</td>
                    <td>x</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Col>
    )
}

export default PokemonCard;