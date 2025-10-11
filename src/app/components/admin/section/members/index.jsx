"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import style from "../../../../../../public/assets/css/module/admin/members.module.css";
import MemberService from "@/app/services/MemberService";

function MembersAdmin() {
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [memberImage, setMemberImage] = useState(null);

  const [reqMember, setReqMember] = useState({
    email: "",
    jobTitle: "",
    fullName: "",
  });

  useEffect(() => {
    refreshMembers();
  }, []);

  const refreshMembers = () => {
    MemberService.getMembers()
      .then((response) => {
        if (
          response.data.status.code === 200 ||
          response.data.status.code === 404
        ) {
          setMembers(response.data.response);
          setMemberImage(null)
        }
      })
      .catch((error) => {
        console.log("something went wrong-", error);
      })
      .finally();
  };

  const handleChange = (e) => {
    setReqMember({ ...reqMember, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setMemberImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    MemberService.addOrUpdatMember(reqMember, memberImage, updateId)
      .then((response) => {
        if (response.data.status.code === 200) {
          refreshMembers();
          setModal(false); // modalı kapat
          setUpdateId(null); // temizle
          setReqMember({ email: "", jobTitle: "", fullName: "" }); // formu temizle
        } else {
          console.log("something went wrong - ", response.data.status.message);
        }
      })
      .catch((error) => console.log("something went wrong-", error));
  };

  const handleDelete = (id) => {
    MemberService.deleteMember(id)
      .then((response) => {
        if (response.data.status.code === 200) {
          refreshMembers();
        } else {
          console.log("something went wrong - ", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("something went wrong-", error);
      });
  };

  return (
    <div className={style.container}>
      {members &&
        members.map((member) => (
          <div className={style.memberContainer} key={member.id}>
            <div className={style.imageContainer}>
              <Image
                src={
                  member.imageUrl
                    ? member.imageUrl
                    : "/images/admin/question.png"
                }
                alt={member.fullName}
                width={80}
                height={80}
                className={style.image}
              />
              {console.log(member.imageUrl)}
            </div>
            <div className={style.dataContainer}>
              <p>{member.email}</p>
              <p>{member.fullName}</p>
              <p>{member.jobTitle}</p>
            </div>
            <div className={style.buttonContainer}>
              <button
                className={style.blueButton}
                onClick={() => {
                  setModal(true);
                  setUpdateId(member.id);
                  setReqMember({
                    email: member.email,
                    fullName: member.fullName,
                    jobTitle: member.jobTitle,
                  });
                }}
              >
                Change
              </button>
              <button
                className={style.deleteButton}
                onClick={() => handleDelete(member.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      <div className={style.memberContainer}>
        <button className={style.addButton} onClick={() => setModal(true)}>
          ADD NEW MEMBER
        </button>
      </div>

      {modal && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <h2>{updateId ? "Update Member" : "Add Member"}</h2>
            <form onSubmit={handleSubmit} className={style.form}>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={reqMember.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={reqMember.fullName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title"
                value={reqMember.jobTitle}
                onChange={handleChange}
              />
              <input type="file" onChange={handleImageChange} />
              <div className={style.modalButtons}>
                <button type="submit" className={style.blueButton}>
                  Save
                </button>
                <button
                  type="button"
                  className={style.deleteButton}
                  onClick={() => setModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembersAdmin;
