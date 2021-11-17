import React from 'react';
import FeatureBlock from 'components/feature-block';

const data = [
  {
    id: 1,
    // background: '#feeec8',
    background: '#f4a123',
    title: 'Daftar atau Masuk',
    description: 'Daftar menjadi member baru atau masuk dengan akun KF Mobile mu',
  },
  {
    id: 2,
    // background: '#ceeffe',
    background: '#f4a123',
    title: 'Pilih Produk',
    description:
      'Pilih produk yang kamu cari, masukkan ke keranjang belanja',
  },
  {
    id: 3,
    // background: '#d4f8c4',
    background: '#f4a123',
    title: 'Ambil nomor antrian',
    description: 'Ambil nomor antrian dan tunggu pesananmu disiapkan apoteker',
  },
  {
    id: 4,
    // background: '#d8dafe',
    background: '#f4a123',
    title: 'Bayar Pesananmu',
    description:
      'Pesananmu sudah siap diambil dan dibayarkan di meja pengambilan obat',
  },
];

export default function HowItWorks() {
  return (
    <div className="flex w-full px-20px md:p-30px py-40px rounded border border-gray-300 bg-white" style={{backgroundColor: 'white', border: 'none', borderRadius: '15px', marginTop: '30px'}}>
      <div className="feature-block-wrapper w-full grid grid-cols-1 gap-x-30px gap-y-40px md:grid-cols-4 xl:grid-cols-4 xxl:gap-30px">
        {data.map((item, index) => (
          <FeatureBlock
            key={item.id}
            title={item.title}
            description={item.description}
            counterBg={item.background}
            counter={index + 1}
            className="feature-block"
          />
        ))}
      </div>
    </div>
  );
}
