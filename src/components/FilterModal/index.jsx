import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { setOpenSearch } from '../../store/slices/pokemonSlice';

const FilterModal = ({modalContent}) => {
  const dispatch = useDispatch();
  const openStatus = useSelector(state => state.pokemon.open);

  // useEffect(() => {
  //   setOpenSearch(openStatus);
  // }, [openStatus]);

  return (
    <>
        {modalContent()}
    </>
  );
};
export default FilterModal;