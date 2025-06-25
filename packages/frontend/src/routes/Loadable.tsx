import { Suspense } from "react";

const Loadable = (Component: any) =>
  function (props: any) {
    return (
      <Suspense fallback={<div />}>
        <Component {...props} />
      </Suspense>
    );
  };

export default Loadable;
