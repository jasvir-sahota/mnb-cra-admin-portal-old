import SearchExercise from "./SearchExercise";

const AddSuperset = ({
  rowId,
  callback
}: {
  rowId: number,
  callback: Function
}) => {
  return (
    <div>
      <SearchExercise
        callback = {(exercise: string) => callback(rowId, exercise)}
      />
    </div>
  )
};

export default AddSuperset;
