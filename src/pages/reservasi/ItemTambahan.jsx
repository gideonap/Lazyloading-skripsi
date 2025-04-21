import React, { useEffect, useState } from 'react';
import { Button, ItemCard } from '../../components/index';
import { getAllPerlengkapan } from '../../services/perlengkapanService.js';
import _ from 'lodash';

const ItemTambahan = ({ onSubmit, onPrev }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedTambahan, setSelectedTambahan] = useState([]); // State to hold selected items

  useEffect(() => {
    getAllPerlengkapan(localStorage.getItem('token')).then((response) => {
      const list = response.data.map((s) => {
        const detail = JSON.parse(s.deskripsi);
        return {
          ...s,
          jenis: detail.jenis,
          kode: detail.kode,
          nama: s.nama, // Include item name
          image: s.image,
        };
      });

      setFilteredItems(list);
    });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedTambahan); // Pass selected items with their name, harga, jumlah, etc.
  };

  const handleQuantityChange = (id, quantity) => {
    const selectedItem = filteredItems.find((s) => s.id === id);

    if (quantity === 0) {
      setSelectedTambahan((prevSelected) =>
        prevSelected.filter((item) => item.perlengkapan_id !== id)
      );
    } else {
      setSelectedTambahan((prevSelected) => {
        const existingIndex = _.findIndex(prevSelected, (s) => s.perlengkapan_id === id);
        if (existingIndex !== -1) {
          const updated = [...prevSelected];
          updated[existingIndex].jumlah = quantity; // Update quantity
          return updated;
        } else {
          // Add new item
          return [
            ...prevSelected,
            {
              perlengkapan_id: id,
              nama: selectedItem.nama, // Add item name
              harga: selectedItem.harga,
              jumlah: quantity,
            },
          ];
        }
      });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Filter items based on the search query
    const results = filteredItems.filter((item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(results);
  };

  return (
    <div className="flex flex-col gap-3 items-center px-10 lg:px-28">
      <div className="flex flex-col items-center">
        <h2 className="font-semibold text-2xl lg:text-4xl">Reservasi</h2>
        <p className="text-secondary-gray">Item Tambahan</p>
      </div>

      <div className="flex flex-col w-72 lg:w-[40rem] gap-4 lg:max-w-[40rem] items-center">
        <div className="flex flex-row gap-5 text-sm">
          <input
            type="text"
            placeholder="Cari Item"
            className="px-3 py-2 w-72 rounded-full ring-1 ring-inactive-gray-2"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-accent text-white rounded-lg transition-colors shadow-md duration-300 hover:bg-hover-green"
            onClick={handleSearchSubmit}
          >
            Cari
          </button>
        </div>

        <div className="flex flex-wrap w-full gap-0 justify-between">
          {filteredItems.map((item, index) => (
            <ItemCard
              item={item}
              key={item.kode ?? index}
              onQuantityChange={handleQuantityChange}
              className="w-[19.5rem]"
            />
          ))}
        </div>

        <div className="flex w-full justify-between mt-4">
          <Button onClick={onPrev}>Kembali</Button>
          <Button onClick={handleSubmit}>Selanjutnya</Button>
        </div>
      </div>
    </div>
  );
};

export default ItemTambahan;
