import Int "mo:core/Int";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
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

  var nextId = 0;

  // Use persistent Map to store entries
  let gratitudeEntries = Map.empty<Id, GratitudeEntry>();

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
};
