import React from "react";

import { Stories } from "./Stories";
import { Header } from "./Header";
import { Tweets } from "./Tweets";

export const TwitterHeaderScreen = () => {
  return (
    <>
      <Header />

      <Stories />

      <Tweets />
    </>
  );
};
