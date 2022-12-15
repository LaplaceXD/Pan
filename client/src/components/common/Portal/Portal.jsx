import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

function Portal({ children, id = "portal-wrapper" }) {
  const [wrapper, setWrapper] = useState(null);

  useLayoutEffect(() => {
    let element = document.getElementById(id);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = document.createElement("div");
      element.setAttribute("id", id);
      document.getElementById("root").appendChild(element);
    }

    setWrapper(element);
    return () => systemCreated && element?.remove();
  }, []);

  return wrapper ? createPortal(children, wrapper) : null;
}

export default Portal;
