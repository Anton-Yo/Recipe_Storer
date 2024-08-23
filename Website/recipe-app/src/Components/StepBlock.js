import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'



const StepBlock = ({step}) => {

  return (
    <div className="w-50 m-auto">
      <div className="mt-1 bg-danger text-center">
        <h6 className="pt-1"> Step {step.count} </h6>
        <div className="d-flex justify-content-center">
          <p className="mx-1"> {step.desc} </p>
        </div>
      </div>
    </div>
  );
}

export default StepBlock;