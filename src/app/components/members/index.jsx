import Image from "next/image";
import style from "../../../../public/assets/css/module/aboutussection/members.module.css";

function Members() {
  return (
    <section className={style.teamSection}>
      <h4>TEAM MEMBER</h4>
      <h2>Develop comprehensive solutions for each Members</h2>
      <div className={style.teamGrid}>
        {[
          {
            name: "Michael Smith Mike",
            role: "Project Engineer",
            img: "/images/team1.jpeg",
          },
          {
            name: "Delilah Brooklyn",
            role: "Managing Director",
            img: "/images/team2.jpg",
          },
          {
            name: "Leilani Kennedy",
            role: "Interior Designer",
            img: "/images/team3.jpg",
          },
          {
            name: "Bella Natalia",
            role: "Architect",
            img: "/images/team4.jpg",
          },
        ].map((member, i) => (
          <div key={i} className={style.teamCard}>
            <Image
              src={member.img}
              alt={member.name}
              width={300}
              height={300}
              className={style.memberImage}
            />
            <h5>{member.role}</h5>
            <p>{member.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Members;
