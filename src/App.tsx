import { useEffect, useState } from "react";
import "./App.css";
import { meals, Meal } from "./meals";
import copy from "copy-to-clipboard";

function App() {
  const [meal, setMeal] = useState<Meal | null>(() => {
    const selectedMealsFromCache = JSON.parse(
      window.localStorage.getItem("selectedMeals") ?? "[]"
    );
    const skippedMealsFromCache = JSON.parse(
      window.localStorage.getItem("skippedMeals") ?? "[]"
    );
    return getRandomMeal(selectedMealsFromCache, skippedMealsFromCache);
  });
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>(() => {
    return JSON.parse(window.localStorage.getItem("selectedMeals") ?? "[]");
  });
  const [skippedMeals, setSkippedMeals] = useState<Meal[]>(() => {
    return JSON.parse(window.localStorage.getItem("skippedMeals") ?? "[]");
  });

  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    if (selectedMeals.length === meals.length) {
      setMeal(null);
      return;
    }

    let meal = getRandomMeal(selectedMeals, skippedMeals);

    if (!meal) {
      window.localStorage.setItem("skippedMeals", JSON.stringify([]));
      setSkippedMeals([]);

      meal = getRandomMeal(selectedMeals, skippedMeals);
    }

    setMeal(meal);
  }, [selectedMeals, skippedMeals]);

  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="App">
      <i
        className="fa-sharp fa-solid fa-bars"
        style={{
          alignSelf: "flex-start",
          marginBottom: "16px",
          fontSize: "24px",
        }}
        onClick={() => {
          setIsListOpen(!isListOpen);
        }}
      ></i>

      {!isListOpen && (
        <>
          <Card
            meal={meal}
            onSkipClicked={(meal) => {
              const updatedSkippedMeals = [...skippedMeals, meal];

              window.localStorage.setItem(
                "skippedMeals",
                JSON.stringify(updatedSkippedMeals)
              );

              setSkippedMeals([...updatedSkippedMeals]);
            }}
            onAddToMenuClicked={(meal) => {
              const updatedSelectedMeals = [...selectedMeals, meal];

              window.localStorage.setItem(
                "selectedMeals",
                JSON.stringify(updatedSelectedMeals)
              );

              setSelectedMeals([...updatedSelectedMeals]);
            }}
          />

          <div className="selectedMealsContainer">
            {selectedMeals
              .sort((a, b) => {
                return a.name.localeCompare(b.name);
              })
              .map((meal) => {
                return <div key={meal.name}>{meal.name}</div>;
              })}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedMeals.length > 0 && (
              <button
                style={{ padding: "6px 12px 10px", marginBottom: "8px" }}
                onClick={() => {
                  const mealPlanDetails = selectedMeals
                    .map((meal) => {
                      return `${meal.name}: ${meal.source}`;
                    })
                    .join("\n");

                  var ua = navigator.userAgent.toLowerCase();
                  var isAndroid = ua.indexOf("android") > -1;

                  const isIos =
                    [
                      "iPad Simulator",
                      "iPhone Simulator",
                      "iPod Simulator",
                      "iPad",
                      "iPhone",
                      "iPod",
                    ].includes(navigator.platform) ||
                    // iPad on iOS 13 detection
                    (navigator.userAgent.includes("Mac") &&
                      "ontouchend" in document);

                  if (isIos || isAndroid) {
                    navigator.share({
                      text: mealPlanDetails,
                    });
                  } else {
                    copy(mealPlanDetails);
                  }
                }}
              >
                📝 get meal plan details
              </button>
            )}

            <button
              style={{ padding: "6px 12px 10px" }}
              onClick={() => {
                window.localStorage.setItem(
                  "selectedMeals",
                  JSON.stringify([])
                );
                setSelectedMeals([]);

                window.localStorage.setItem("skippedMeals", JSON.stringify([]));
                setSkippedMeals([]);
              }}
            >
              ♻️ reset
            </button>
          </div>
        </>
      )}

      {isListOpen && (
        <div className="listContainer">
          <input
            type="text"
            placeholder="Search"
            className="search"
            onChange={(e) => {
              const searchValue = e.target.value.toLowerCase();
              setSearchValue(searchValue);
            }}
          />

          <div className="list">
            {meals
              .sort((a, b) => {
                return a.name.localeCompare(b.name);
              })
              .filter((meal) => {
                if (searchValue === "") {
                  return true;
                }

                return (
                  meal.name.toLowerCase().includes(searchValue) ||
                  meal.source.toLowerCase().includes(searchValue) ||
                  meal.ingredients.some((ingredient) =>
                    ingredient.toLowerCase().includes(searchValue)
                  )
                );
              })
              .map((meal) => {
                return (
                  <div
                    key={meal.name}
                    className="listItem"
                    style={{
                      backgroundColor:
                        selectedMeals.find((m) => m.name === meal.name) &&
                        "#004700",
                    }}
                  >
                    <div>{meal.name}</div>
                    {selectedMeals.find((m) => m.name === meal.name) && (
                      <i
                        className="fa-sharp fa-solid fa-times listIcon"
                        style={{
                          alignSelf: "flex-end",
                          fontSize: "24px",
                        }}
                        onClick={() => {
                          const updatedSelectedMeals = selectedMeals.filter(
                            (m) => m.name !== meal.name
                          );

                          window.localStorage.setItem(
                            "selectedMeals",
                            JSON.stringify(updatedSelectedMeals)
                          );

                          setSelectedMeals([...updatedSelectedMeals]);
                        }}
                      ></i>
                    )}
                    {!selectedMeals.find((m) => m.name === meal.name) && (
                      <i
                        className="fa-sharp fa-solid fa-plus listIcon"
                        style={{
                          alignSelf: "flex-end",
                          fontSize: "24px",
                        }}
                        onClick={() => {
                          const updatedSelectedMeals = [...selectedMeals, meal];

                          window.localStorage.setItem(
                            "selectedMeals",
                            JSON.stringify(updatedSelectedMeals)
                          );

                          setSelectedMeals([...updatedSelectedMeals]);
                        }}
                      ></i>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  meal: Meal | null;
  onSkipClicked: (meal: Meal) => void;
  onAddToMenuClicked: (meal: Meal) => void;
}

function Card(props: CardProps) {
  const { meal } = props;

  if (!meal) {
    return (
      <div style={{ padding: "16px" }} className="card">
        No more meals to show! 🤷‍♀️
      </div>
    );
  }

  return (
    <div className="card">
      <span className="mealName">{meal.name}</span>
      <span className="mealSource">{meal.source}</span>

      <div className="cardButtonContainer">
        <button
          style={{ marginRight: "4px", backgroundColor: "#004700" }}
          onClick={() => {
            props.onAddToMenuClicked(meal);
          }}
        >
          ➕ add to menu
        </button>
        <button
          style={{ backgroundColor: "#6b0000" }}
          onClick={() => {
            props.onSkipClicked(meal);
          }}
        >
          🚫 skip
        </button>
      </div>
    </div>
  );
}

// function that returns a random meal and allows me to provides 2 lists of names to exclude
function getRandomMeal(
  selectedMeals?: Meal[],
  skippedMeals?: Meal[]
): Meal | null {
  const randomIndex = Math.floor(Math.random() * meals.length);

  const selectedMealNames = selectedMeals?.map((meal) => meal.name) ?? [];
  const skippedMealNames = skippedMeals?.map((meal) => meal.name) ?? [];
  const mealNamesToExclude = [...selectedMealNames, ...skippedMealNames];

  if (mealNamesToExclude.length >= meals.length) {
    return null;
  }

  if (mealNamesToExclude.includes(meals[randomIndex].name)) {
    return getRandomMeal(selectedMeals, skippedMeals);
  }

  return meals[randomIndex];
}

// function that gets meal by name
function getMealByName(name: string): Meal {
  return meals.find((meal) => meal.name === name)!;
}

export default App;
