import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import PageTitle from "../utils/components/PageTitle";
import Cafe from "../utils/components/Cafe";

export function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}

export default function Home(props) {
  const post = { title: "Daily Lunch Order" };
  
  useEffect(() => {}, []);

  const getCafeInfos = () => {
    const cafe_ref = ref(database, "cafe");
    var arra = [];
    onValue(cafe_ref, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const cafe = Object.keys(data);
        cafe.forEach((c) => {
          arra.push(data[c]);
        });
      }
    });
    SetCafes(arra);
  };

  return (
    <>
      <div className={styles.container}>
        <div></div>
        <PageTitle page={post} />
        <section id="content">
          <div className="content-wrap">
            <div className="container clearfix">
              <h5>
                {/* <Link href="/food-order-history">
                <a className="history-link">
                  {" "}
                  &gt;&gt;&gt; Food Order History{" "}
                </a>
              </Link> */}
              </h5>
              <br />
              <Cafe/>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
