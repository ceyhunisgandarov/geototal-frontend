"use client";
import Image from "next/image";
import style from "../../../../public/assets/css/module/aboutussection/members.module.css";
import { useEffect, useState } from "react";
import MemberService from "@/app/services/MemberService";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

const defaultMembers = [
  {
    fullName: "Michael Smith Mike",
    jobTitle: "Project Engineer",
    imageUrl: "/images/team1.jpeg",
    email: "test@gmail.com",
  },
  {
    fullName: "Delilah Brooklyn",
    jobTitle: "Managing Director",
    imageUrl: "/images/team2.jpg",
    email: "test@gmail.com",
  },
  {
    fullName: "Leilani Kennedy",
    jobTitle: "Interior Designer",
    imageUrl: "/images/team3.jpg",
    email: "test@gmail.com",
  },
  {
    fullName: "Bella Natalia",
    jobTitle: "Architect",
    imageUrl: "/images/team4.jpg",
    email: "test@gmail.com",
  },
];

function Members() {
  const [dbMembers, setDbMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshMembers();
  }, []);

  const refreshMembers = () => {
    MemberService.getMembers()
      .then((response) => {
        console.log("Member API response:", response.data); // 👈 burada kontrol et

        if (
          response.data.status.code === 200 &&
          response.data.response?.length > 0
        ) {
          setDbMembers(response.data.response);
        } else {
          console.warn("Fallback: using default members");
          setDbMembers(defaultMembers);
        }
      })
      .catch((err) => {
        console.error("Member API error:", err);
        setDbMembers(defaultMembers);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 800); // küçük gecikme (smooth transition)
      });
  };

  const renderMembers = dbMembers.length > 0 ? dbMembers : defaultMembers;

  return (
    <section className={style.teamSection}>
      <h4>TEAM MEMBER</h4>
      <h2>Develop comprehensive solutions for each Member</h2>
      <div className={style.teamGrid}>
        {loading
          ?
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={style.skeletonCard}>
                <div className={style.skeletonImage}></div>
                <div className={`${style.skeletonText} ${style.short}`}></div>
                <div className={`${style.skeletonText} ${style.long}`}></div>
              </div>
            ))
          : 
            renderMembers.map((member, i) => (
              <div key={i} className={style.teamCard}>
                <Image
                  src={
                    member?.imageUrl
                      ? `${BASE_IMAGE_URL}${member.imageUrl}`
                      : "/images/default-user.png"
                  }
                  alt={member?.fullName || "Member"}
                  width={300}
                  height={300}
                  priority
                  className={style.memberImage}
                />
                <h5>{member.jobTitle}</h5>
                <p>{member.fullName}</p>
                <a
                  href={`mailto:${member.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={style.email}
                >
                  {member.email}
                </a>
              </div>
            ))}
      </div>
    </section>
  );
}

export default Members;
