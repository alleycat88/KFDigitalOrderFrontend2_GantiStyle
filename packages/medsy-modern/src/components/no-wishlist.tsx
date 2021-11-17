import EmptyCartSVG from 'assets/icons/empty-svg';

export default function NoWishlist() {

  return (
    <>
      <div className="flex-auto mt-40px">
        <p className="text-center text-gray-900 px-10 leading-loose">
          Belum ada barang di wishlist-mu
        </p>

        <div className="flex items-center justify-center mt-40px">
          <EmptyCartSVG />
        </div>
      </div>
    </>
  );
}
