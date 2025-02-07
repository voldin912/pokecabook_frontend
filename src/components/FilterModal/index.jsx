import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { setOpen } from '../../store/slices/pokemonSlice';

const FilterModal = ({modalContent}) => {
  const dispatch = useDispatch();
  const openStatus = useSelector(state => state.pokemon.open);

  // useEffect(() => {
  //   setOpen(openStatus);
  // }, [openStatus]);

  return (
    <>
        {modalContent()}
    </>
  );
};
export default FilterModal;