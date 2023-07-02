import { ActivityType } from "../interfaces";

/* Für später um nahe ereignisse zu suchen:
{
  location:{
    $nearSphere:{
      $geometry:{
        type: "Point",
        coordinates: [20,20]
      }
    }
  }
} 
*/
export function searchActivities(searchQuery: string, activities: ActivityType[]) {
  const searchResult: ActivityType[] = [];
  // Iteriert über das gegebene activities-Array und überprüft, ob der Name, Verein oder die Sportart einer Aktivität den Suchbegriff enthält.
  for (const activity of activities) {
    if (activity.name.toLowerCase().includes(searchQuery)) {
      // Übereinstimmende Aktivität wird in die searchResult-Liste gepushed
      searchResult.push(activity);
    }
  }
  // Funktion gibt Liste mit allen Suchergebnissen zurück
  return searchResult;
}

// Mit der Funktion wird anhand von den Angaben des Nutzers im Profil ein Modell erstellt, mit welchen alle Aktivitäten
// durchsucht und gefiltert werden können.
// Wenn der Nutzer Angaben getätigt hat, müssen die Angaben der Aktivität mit diesen übereinstimmen
export function constructPreferenceModel(account, id) {
  let model: object = { active: true };
  if (account.categories.length > 0) {
    const categoryIds: string[] = [];
    for (const category of account.categories) {
      categoryIds.push(category);
    }
    model = { ...model, categories: { $in: categoryIds } };
  }
  if (id) {
    model = { ...model, organizer: { $nin: id } };
  }
  return model;
}

// Sortiert zufällig eine Liste
export function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
