import HeaderInfoImage from "/assets/header-info-img.jpg";

const HeaderInfo = () => {
  return (
    <section className="w-full relative">
      {/* Background Image */}
      <div className="relative w-full overflow-hidden">
        <img
          src={HeaderInfoImage}
          alt="Header"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </section>
  );
};

export default HeaderInfo;
