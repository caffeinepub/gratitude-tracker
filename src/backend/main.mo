import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Id = Nat;

  type GratitudeEntry = {
    id : Id;
    text : Text;
    category : ?Text;
    timestamp : Int;
  };

  module GratitudeEntry {
    public func compare(a : GratitudeEntry, b : GratitudeEntry) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  type Goal = {
    id : Id;
    text : Text;
    completed : Bool;
    createdAt : Int;
  };

  module Goal {
    public func compare(a : Goal, b : Goal) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  var nextId = 0;

  let gratitudeEntries = Map.empty<Id, GratitudeEntry>();
  let goals = Map.empty<Id, Goal>();

  public shared ({ caller }) func addEntry(text : Text, category : ?Text) : async GratitudeEntry {
    let id = nextId;
    nextId += 1;

    let entry : GratitudeEntry = {
      id;
      text;
      category;
      timestamp = Time.now();
    };

    gratitudeEntries.add(id, entry);
    entry;
  };

  public query ({ caller }) func getEntries() : async [GratitudeEntry] {
    gratitudeEntries.values().toArray().sort();
  };

  public shared ({ caller }) func deleteEntry(id : Id) : async () {
    switch (gratitudeEntries.get(id)) {
      case (null) { Runtime.trap("Entry does not exist") };
      case (?_) {
        gratitudeEntries.remove(id);
      };
    };
  };

  public shared ({ caller }) func addGoal(text : Text) : async Goal {
    let id = nextId;
    nextId += 1;

    let goal : Goal = {
      id;
      text;
      completed = false;
      createdAt = Time.now();
    };

    goals.add(id, goal);
    goal;
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    goals.values().toArray().sort();
  };

  public shared ({ caller }) func updateGoal(id : Id, completed : Bool) : async Goal {
    switch (goals.get(id)) {
      case (null) {
        Runtime.trap("Goal does not exist");
      };
      case (?goal) {
        let updatedGoal : Goal = {
          id = goal.id;
          text = goal.text;
          completed;
          createdAt = goal.createdAt;
        };
        goals.add(id, updatedGoal);
        updatedGoal;
      };
    };
  };

  public shared ({ caller }) func deleteGoal(id : Id) : async () {
    switch (goals.get(id)) {
      case (null) { Runtime.trap("Goal does not exist") };
      case (?_) {
        goals.remove(id);
      };
    };
  };

  public query ({ caller }) func getSuggestedGoals() : async [Text] {
    [
      "Write 3 things I'm grateful for each morning",
      "Express gratitude to a friend this week",
      "Reflect on a positive memory each day",
      "Compliment someone sincerely today",
      "Take a walk and appreciate nature",
    ];
  };
};
