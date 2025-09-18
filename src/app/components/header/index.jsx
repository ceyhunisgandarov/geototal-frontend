import style from "../../../../public/assets/css/module/header/header.module.css";

function Header({ image, title }) {
  return (
    <div
      className={style.container}
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className={style.overlay}>
        <p className={style.title}>{title}</p>
      </div>
    </div>
  );
}

export default Header;
