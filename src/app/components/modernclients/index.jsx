// ClientArea.jsx
import { useEffect, useState } from "react";
import styles from "../../../../public/assets/css/module/modern/client.module.css";
import CollaborationService from "@/app/services/CollaborationService";

export default function ClientArea() {
  const [collabrations, setCollabrations] = useState([]);

  useEffect(()=> {
    getCollabrationList()
  }, [])

  const getCollabrationList = () => {
    CollaborationService.getCollaborationList()
      .then((response) => {
        if (response.data.status.code === 200) {
          setCollabrations(response.data.response);
        } else {
          console.log("Something wrong error-", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("Something went error-", error);
      });
  };

  return (
    <section className={styles.clientArea}>
      <div className={styles.wrapper}>
        {/* Testimonials */}
        {/* <div className={styles.testimonials}>
          <div className={styles.testimonialCard}>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
            <h4>Wiliam Harry</h4>
          </div>
        </div> */}

        {/* Clients */}
        <div className={styles.clients}>
          {collabrations && collabrations.map((collabration) => (
            <div key={collabration.id} className={styles.clientCard}>
              <img
                src={collabration.imageUrl}
                alt={collabration.name}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
