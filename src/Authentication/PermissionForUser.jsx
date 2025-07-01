import { AbilityBuilder, PureAbility } from "@casl/ability";
import React, { createContext, useContext } from "react";

export const AbilityContext = createContext(new PureAbility([]));

function PermissionForUser(user) {
  // If no user is provided, return an empty ability
  if (!user) {
    return new PureAbility([]);
  }

  const { can, cannot, build } = new AbilityBuilder(PureAbility);

  if (user.role === "manager") {
    can("manage", "adminAll");
    can("manage", "announcement");
    can("delete", "discussions");
    can("delete", "posts");
    cannot("update", "posts");
    can("view", "reports");
    can("add", "admin");
    cannot("add", "resourceRequest");
    can("view", "resources");
    cannot("view", "communityProfile");
    cannot("add", "review");
    can("update", "review");
    can("delete", "review");
  } else if (user.role === "librarian") {
    can("manage", "adminSome");
    cannot("add", "resourceRequest");
    can("delete", "discussions");
    cannot("add", "communityProfile");
    can("view", "resources");
    cannot("make", "payment");
    cannot("add", "review");
    can("update", "review");
    can("delete", "review");
  } else if (user.role === "member") {
    cannot("manage", "adminAll");
    cannot("manage", "adminSome");
    can("make", "request");
    can("choose", "membership");
    can("delete", "discussions");
    can("update", "discussion");
    can("delete", "posts");
    can("vote", "votes");
    can("add", "resourceRequest");
    can("view", "communityProfile");
    can("make", "payment");
    can("update", "posts");
    can("view", "resources");
    can("view", "payment");
    can("add", "review");
    can("update", "review");
    can("delete", "review");
  } else if (user.role === "community_member") {
    can("add", "posts");
    can("choose", "membership");
    can("delete", "posts");
    can("update", "posts");
    can("view", "posts");
    can("vote", "votes");
    can("add", "discussion");
    can("delete", "discussion");
    can("update", "discussion");
    can("view", "discussion");
    can("view", "communityProfile");
  }

  return build();
}

export default PermissionForUser;

export const Ability = () => {
  return useContext(AbilityContext);
};
